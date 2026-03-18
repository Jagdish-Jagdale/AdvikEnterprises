import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Package, Tag, FileText, LayoutGrid, Loader2, Plus, Trash } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const AddProductModal = ({ isOpen, onClose, onSave, product = null, loading = false }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [descriptionPoints, setDescriptionPoints] = useState(['']);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories for the dropdown
  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      const sortedCats = [
        ...cats.filter(cat => cat.name?.toLowerCase() !== 'other'),
        ...cats.filter(cat => cat.name?.toLowerCase() === 'other')
      ];
      setCategories(sortedCats);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || '');
      // Split description by newlines into points
      setDescriptionPoints(product.description ? product.description.split('\n') : ['']);
      setImagePreview(product.image || null);
    } else {
      setName('');
      setCategory('');
      setDescriptionPoints(['']);
      setImagePreview(null);
    }
    setImageFile(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handlePointChange = (index, value) => {
    const newPoints = [...descriptionPoints];
    newPoints[index] = value;
    setDescriptionPoints(newPoints);
  };

  const addPoint = () => {
    setDescriptionPoints([...descriptionPoints, '']);
  };

  const removePoint = (index) => {
    if (descriptionPoints.length > 1) {
      setDescriptionPoints(descriptionPoints.filter((_, i) => i !== index));
    } else {
      setDescriptionPoints(['']);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && category) {
      // Join points with newlines
      const finalDescription = descriptionPoints
        .map(p => p.trim())
        .filter(p => p !== '')
        .join('\n');
      onSave({ name, category, description: finalDescription }, imageFile);
    }
  };

  const isEdit = !!product;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xl font-inter font-bold text-gray-900">{isEdit ? 'Update Product' : 'Add New Product'}</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">Fill in the details for your catalog item.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"><X size={20} /></button>
        </div>

        <hr className="border-gray-50" />

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                  <Tag size={12} className="text-indigo-400" />
                  Product Name
                </label>
                <input
                  placeholder="Enter product name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-100 transition-all outline-none placeholder:text-gray-300"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                  <LayoutGrid size={12} className="text-indigo-400" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-100 transition-all outline-none appearance-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 ml-1 pr-1">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <FileText size={12} className="text-indigo-400" />
                    Description Points
                  </label>
                  <button
                    type="button"
                    onClick={addPoint}
                    className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                  >
                    <Plus size={12} />
                    Add Point
                  </button>
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {descriptionPoints.map((point, index) => (
                    <div key={index} className="flex gap-2 group">
                      <input
                        placeholder={`Point ${index + 1}...`}
                        value={point}
                        onChange={(e) => handlePointChange(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-100 transition-all outline-none placeholder:text-gray-300"
                        required={index === 0}
                      />
                      {descriptionPoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePoint(index)}
                          className="p-3 text-gray-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[9px] text-gray-400 font-medium italic">Each point will be displayed as a bullet point.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                   <ImageIcon size={12} className="text-indigo-400" />
                   Product Image
                </label>
                <div className="flex flex-col gap-4">
                  <div className="relative aspect-square w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-300">
                        <ImageIcon size={48} />
                        <span className="text-[10px] font-black uppercase tracking-widest">No Image selected</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-[10px] file:font-black file:uppercase file:tracking-widest
                      file:bg-indigo-50 file:text-indigo-600
                      hover:file:bg-indigo-100 transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-[#4F46E5] text-white rounded-lg font-bold text-sm hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isEdit ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                isEdit ? 'Update Product' : 'Save Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
