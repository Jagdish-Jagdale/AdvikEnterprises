document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const fileRemove = document.getElementById('fileRemove');
    const convertBtn = document.getElementById('convertBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const resultCard = document.getElementById('resultCard');
    const uploadCard = document.getElementById('uploadCard');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    let selectedFile = null;

    // ===== Dropzone Events =====
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // ===== File Handling =====
    function handleFile(file) {
        hideError();

        if (!file.name.toLowerCase().endsWith('.pdf')) {
            showError('Please select a valid PDF file.');
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            showError('File size exceeds 50 MB limit.');
            return;
        }

        selectedFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.classList.add('visible');
        convertBtn.classList.add('visible');
    }

    fileRemove.addEventListener('click', () => {
        resetUpload();
    });

    function resetUpload() {
        selectedFile = null;
        fileInput.value = '';
        fileInfo.classList.remove('visible');
        convertBtn.classList.remove('visible');
        hideError();
    }

    // ===== Conversion =====
    convertBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        hideError();
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<span class="btn-content"><span class="spinner"></span> Converting...</span>';
        progressContainer.classList.add('visible');

        // Simulate progress stages
        const progressStages = [
            { width: 15, text: 'Uploading PDF...' },
            { width: 35, text: 'Reading document...' },
            { width: 55, text: 'Extracting tables...' },
            { width: 75, text: 'Generating Excel...' },
            { width: 90, text: 'Finalizing...' },
        ];

        let stageIndex = 0;
        const progressInterval = setInterval(() => {
            if (stageIndex < progressStages.length) {
                const stage = progressStages[stageIndex];
                progressBar.style.width = stage.width + '%';
                progressText.textContent = stage.text;
                stageIndex++;
            }
        }, 600);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            
            const selectedLanguage = document.querySelector('input[name="language"]:checked').value;
            formData.append('language', selectedLanguage);

            const headings = document.getElementById('columnHeadings').value;
            formData.append('headings', headings);

            const response = await fetch('/convert', {
                method: 'POST',
                body: formData
            });

            clearInterval(progressInterval);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Conversion failed');
            }

            // Complete progress
            progressBar.style.width = '100%';
            progressText.textContent = 'Complete!';

            setTimeout(() => {
                showResult(data);
            }, 500);

        } catch (error) {
            clearInterval(progressInterval);
            progressContainer.classList.remove('visible');
            progressBar.style.width = '0%';
            showError(error.message || 'Something went wrong. Please try again.');
            convertBtn.disabled = false;
            convertBtn.innerHTML = `<span class="btn-content">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Convert to Excel
            </span>`;
        }
    });

    // ===== Show Result =====
    function showResult(data) {
        uploadCard.style.display = 'none';

        document.getElementById('tablesFound').textContent = data.tables_found;
        document.getElementById('textPages').textContent = data.text_pages;
        document.getElementById('sheetsCreated').textContent = data.sheets_created;

        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.href = `/download/${data.filename}?name=${encodeURIComponent(data.original_name)}`;

        resultCard.classList.add('visible');
    }

    // ===== Convert Another =====
    document.getElementById('convertAnother').addEventListener('click', () => {
        resultCard.classList.remove('visible');
        uploadCard.style.display = '';
        resetUpload();
        progressContainer.classList.remove('visible');
        progressBar.style.width = '0%';
        convertBtn.disabled = false;
        convertBtn.innerHTML = `<span class="btn-content">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Convert to Excel
        </span>`;
    });

    // ===== Helpers =====
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showError(msg) {
        errorText.textContent = msg;
        errorMessage.classList.add('visible');
    }

    function hideError() {
        errorMessage.classList.remove('visible');
    }
});
