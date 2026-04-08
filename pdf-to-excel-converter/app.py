import os
import re
import uuid
import pdfplumber
import easyocr
import numpy as np
import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from flask import Flask, render_template, request, send_file, jsonify, after_this_request
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB max upload

ALLOWED_EXTENSIONS = {'pdf'}

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize EasyOCR reader (Lazy-loaded caches)
ocr_readers = {}

def get_ocr_reader(lang):
    if lang not in ocr_readers:
        print(f"Initializing OCR Engine for {lang}...")
        langs = ['mr', 'en', 'hi'] if lang == 'mr' else ['en']
        ocr_readers[lang] = easyocr.Reader(langs, gpu=False)
    return ocr_readers[lang]

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def try_voter_list_parsing(text):
    """Specific Voter List RegEx extraction for Marathi lists."""
    voter_data = []
    if not text: return []
    lines = text.split('\n')
    # RegEx for Marathi Voter Card format
    voter_pattern = re.compile(r'^(\d+)\s+(.+?)\s+(.+?)\s+([वप])\s+(.+?)\s+([पुरुष|स्त्री])\s+(\d+)\s*(MT/\d+/\d+/\d+)?')
    
    for line in lines:
        line = line.strip()
        match = voter_pattern.match(line)
        if match:
            voter_data.append({
                'Serial_No': int(match.group(1)),
                'House_Area': match.group(2).strip(),
                'Voter_Name': match.group(3).strip(),
                'Relation_Type': match.group(4),
                'Relation_Name': match.group(5).strip(),
                'Gender': match.group(6),
                'Age': int(match.group(7)),
                'Voter_ID': match.group(8) if match.group(8) else ''
            })
    return voter_data

def find_gutters(words, width):
    """Find vertical gutters (whitespace) to split columns strictly."""
    if not words: return []
    
    # Create a 1D occupancy grid
    # Precision: 1 unit per PDF point
    grid = np.zeros(int(width) + 2)
    for w in words:
        x0, x1 = int(w['x0']), int(w['x1'])
        grid[max(0, x0):min(len(grid), x1+1)] = 1
        
    # Find gaps (where grid == 0)
    gutters = []
    in_gap = False
    gap_start = 0
    
    for i in range(len(grid)):
        if grid[i] == 0 and not in_gap:
            gap_start = i
            in_gap = True
        elif grid[i] == 1 and in_gap:
            gap_end = i
            # Only consider gaps of at least 3 points
            if gap_end - gap_start >= 3:
                gutters.append((gap_start + gap_end) / 2)
            in_gap = False
            
    # Always include 0 and width as boundaries
    boundaries = sorted(list(set([0] + gutters + [width])))
    return boundaries

def extract_ocr_from_page(page, lang):
    """Deep Multi-Resolution OCR with Fallback."""
    # Loop through different resolutions if no text is found
    for dpi in [400, 200]:
        try:
            print(f"      Running OCR at {dpi} DPI...")
            img = page.to_image(resolution=dpi).original
            img_np = np.array(img)
            
            reader = get_ocr_reader(lang)
            results = reader.readtext(img_np)
            
            # Lower confidence to 0.05 to capture faint text
            ocr_words, scale = [], dpi / 72.0
            for bbox, text, conf in results:
                if conf < 0.05: continue
                ocr_words.append({
                    'text': text, 
                    'x0': bbox[0][0] / scale, 
                    'x1': bbox[1][0] / scale, 
                    'top': bbox[0][1] / scale, 
                    'bottom': bbox[2][1] / scale
                })
            
            if not ocr_words:
                print(f"      No text found at {dpi} DPI. Retrying...")
                continue
                
            print(f"      Success: Found {len(ocr_words)} words at {dpi} DPI.")
            
            # Detect global column boundaries (gutters)
            col_boundaries = find_gutters(ocr_words, page.width)
            
            ocr_words.sort(key=lambda w: (round(w['top'], 1), w['x0']))
            rows = []
            current_row = [ocr_words[0]]
            current_top = ocr_words[0]['top']

            for word in ocr_words[1:]:
                # Group into rows based on y-position
                if abs(word['top'] - current_top) < 6: 
                    current_row.append(word)
                else:
                    rows.append(current_row); current_row = [word]; current_top = word['top']
            if current_row: rows.append(current_row)
            
            return rows, col_boundaries
            
        except Exception as e:
            print(f"      OCR (at {dpi} DPI) error: {e}")
            continue
            
    return [], []

def rows_to_exact_table(rows, boundaries):
    """Map words to columns using strict gutter boundaries."""
    if not rows or not boundaries: return []
    table = []
    for row in rows:
        # Pre-allocate row based on columns
        row_data = [''] * (len(boundaries) - 1)
        for word in row:
            wx = (word['x0'] + word['x1']) / 2
            # Find which column slot the word belongs to
            for i in range(len(boundaries) - 1):
                if boundaries[i] <= wx < boundaries[i+1]:
                    if row_data[i]: row_data[i] += " " + word['text']
                    else: row_data[i] = word['text']
                    break
        if any(c.strip() for c in row_data):
            # Clean empty slots (keep the structure)
            table.append(row_data)
    return table

def find_header_row(table, target_headings):
    """Find the best matching header row and its column mapping."""
    if not table or not target_headings: return None, {}
    
    best_row_idx = -1
    best_matches = 0
    mapping = {} # {target_heading: col_index}
    
    # Pre-process target headings
    targets = [h.strip().lower() for h in target_headings.split(',')]
    
    # Search first 10 rows for header
    for r_idx, row in enumerate(table[:10]):
        row_text = [str(c).lower() for c in row]
        current_mapping = {}
        matches = 0
        
        for t in targets:
            for c_idx, cell in enumerate(row_text):
                # Simple containment check for fuzzy matching
                if t in cell or cell in t:
                    current_mapping[t] = c_idx
                    matches += 1
                    break
        
        if matches > best_matches:
            best_matches = matches
            best_row_idx = r_idx
            mapping = current_mapping
            
    return best_row_idx, mapping

def filter_table_by_headings(table, target_headings):
    """Filter table to only certain columns based on headings."""
    if not target_headings or not table: return table
    
    header_idx, mapping = find_header_row(table, target_headings)
    if not mapping:
        print(f"      No column matches found for: {target_headings}. Returning full table.")
        return table
    
    # Sort indices based on target_headings order
    targets = [h.strip().lower() for h in target_headings.split(',')]
    col_indices = [mapping[t] for t in targets if t in mapping]
    
    filtered_table = []
    # Start from header row or 0
    start_row = max(0, header_idx)
    for row in table[start_row:]:
        new_row = [row[i] if i < len(row) else '' for i in col_indices]
        if any(str(c).strip() for c in new_row):
            filtered_table.append(new_row)
            
    if not filtered_table:
        print(f"      Filtering resulted in empty table. Returning original data.")
        return table
        
    return filtered_table

def extract_tables_from_pdf(pdf_path, lang, target_headings=None):
    """Multi-stage high-accuracy extraction pipeline with filtering."""
    all_tables, page_texts, voters = [], [], []
    with pdfplumber.open(pdf_path) as pdf:
        for p_num, page in enumerate(pdf.pages, 1):
            print(f"Processing Page {p_num}...")
            
            # --- High Priority: Special Voter List Detection (Marathi Mode Only) ---
            if lang == 'mr':
                text = page.extract_text()
                voter_page_data = try_voter_list_parsing(text)
                if voter_page_data:
                    # Filter voter data if headings are provided
                    if target_headings:
                        targets = [h.strip().lower() for h in target_headings.split(',')]
                        # Map voter keys to user headings
                        key_map = {
                            'serial': 'Serial_No', 'no': 'Serial_No', 'sr': 'Serial_No',
                            'name': 'Voter_Name', 'voter': 'Voter_Name',
                            'age': 'Age', 'gender': 'Gender', 'sex': 'Gender',
                            'area': 'House_Area', 'house': 'House_Area',
                            'id': 'Voter_ID', 'card': 'Voter_ID'
                        }
                        filtered_voters = []
                        for v in voter_page_data:
                            new_v = {}
                            for t in targets:
                                matched_key = None
                                for k, v_key in key_map.items():
                                    if k in t: matched_key = v_key; break
                                if matched_key: new_v[t] = v.get(matched_key, '')
                                else: new_v[t] = '' # Heading not found in logic
                            filtered_voters.append(new_v)
                        voters.extend(filtered_voters)
                    else:
                        voters.extend(voter_page_data)
                    continue

            # --- Forced High-Accuracy Mode: OCR + Gutter Detection ---
            rows, boundaries = extract_ocr_from_page(page, lang)
            
            # --- Fallback: Raw Word Position Layer (if OCR fails but text exists) ---
            if not rows:
                print(f"      OCR failed on Page {p_num}. Attempting raw word detection...")
                words = page.extract_words()
                if words:
                    print(f"      Found {len(words)} raw words. Using word-position logic.")
                    boundaries = find_gutters(words, page.width)
                    # Simple row grouping for raw words
                    words.sort(key=lambda w: (round(w['top'], 1), w['x0']))
                    rows, current_row, current_top = [], [words[0]], words[0]['top']
                    for word in words[1:]:
                        if abs(word['top'] - current_top) < 4: current_row.append(word)
                        else: rows.append(current_row); current_row = [word]; current_top = word['top']
                    if current_row: rows.append(current_row)

            if rows:
                table_data = rows_to_exact_table(rows, boundaries)
                if table_data:
                    if target_headings:
                        table_data = filter_table_by_headings(table_data, target_headings)
                    if table_data:
                        print(f"      Success: Extracted {len(table_data)} rows of table data.")
                        all_tables.append({'page': p_num, 'data': table_data})
                continue
            
            # Final Fallback
            print(f"      Final fallback: Raw text extraction for Page {p_num}.")
            text = page.extract_text()
            if text:
                lines = text.split('\n')
                page_texts.append({'page': p_num, 'lines': [[l.strip()] for l in lines]})
            else:
                print(f"      WARNING: No content could be detected on Page {p_num}.")
            
    return all_tables, page_texts, voters, len(pdf.pages)

def create_excel_with_pandas(tables, page_texts, voters, output_path):
    """Use pandas for clean Excel generation with statistics."""
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        s_count = 0
        
        # 1. Voters Tab
        if voters:
            df_v = pd.DataFrame(voters)
            df_v.to_excel(writer, sheet_name='Voter_List', index=False)
            
            # Statistics Tab (Only if standard keys exist)
            if 'Gender' in df_v.columns or any('gender' in str(c).lower() for c in df_v.columns):
                g_col = 'Gender' if 'Gender' in df_v.columns else [c for c in df_v.columns if 'gender' in str(c).lower()][0]
                male_count = len(df_v[df_v[g_col].astype(str).str.contains('पुरुष', na=False)])
                female_count = len(df_v[df_v[g_col].astype(str).str.contains('स्त्री', na=False)])
                
                stats = pd.DataFrame({
                    'Marathi Metric': ['एकूण मतदार', 'पुरुष', 'स्त्री'],
                    'Metric(En)': ['Total Voters', 'Male', 'Female'],
                    'Value': [len(df_v), male_count, female_count]
                })
                stats.to_excel(writer, sheet_name='Statistics', index=False)
                s_count += 2
            else:
                s_count += 1

        # 2. General Tables
        for t_info in tables:
            s_count += 1
            df = pd.DataFrame(t_info['data'])
            df = df.dropna(axis=1, how='all')
            df.to_excel(writer, sheet_name=f'Data_{s_count}', index=False, header=False)
            
        # 3. Simple Text Pages
        for t_info in page_texts:
            s_count += 1
            df = pd.DataFrame(t_info['lines'])
            df.to_excel(writer, sheet_name=f'Text_{s_count}', index=False, header=False)

        if s_count == 0:
            pd.DataFrame({'Info': ['No content detected.']}).to_excel(writer, sheet_name='Empty', index=False)

    return s_count

@app.route('/')
def index(): return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert():
    file = request.files.get('file')
    lang = request.form.get('language', 'mr')
    headings = request.form.get('headings', '')
    
    if not file or not allowed_file(file.filename): 
        return jsonify({'error': 'Invalid file'}), 400
    
    u_id, o_name = str(uuid.uuid4())[:8], secure_filename(file.filename)
    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{u_id}_{o_name}")
    file.save(pdf_path)
    
    try:
        tables, page_texts, voters, total_p = extract_tables_from_pdf(pdf_path, lang, headings)
        ex_name = f"{u_id}_{o_name.rsplit('.', 1)[0]}.xlsx"
        ex_path = os.path.join(app.config['UPLOAD_FOLDER'], ex_name)
        sheets = create_excel_with_pandas(tables, page_texts, voters, ex_path)
        os.remove(pdf_path)
        return jsonify({'success': True, 'filename': ex_name, 'original_name': o_name.rsplit('.', 1)[0] + '.xlsx',
                        'voters_found': len(voters), 'tables_found': len(tables), 'text_pages': len(page_texts), 
                        'sheets_created': sheets, 'total_pages': total_p})
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/download/<filename>')
def download(filename):
    f_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(filename))
    @after_this_request
    def cleanup(r):
        try: os.remove(f_path)
        except: pass
        return r
    return send_file(f_path, as_attachment=True, download_name=request.args.get('name', filename))

if __name__ == '__main__': app.run(debug=True, port=5000)
