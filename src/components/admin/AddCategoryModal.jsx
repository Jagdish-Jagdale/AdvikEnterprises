import React, { useState, useEffect } from 'react';
import { Layers, X, Tag, Loader2 } from 'lucide-react';
const AddCategoryModal = ({ isOpen, onClose, onSave, category = null, loading = false }) => {
  const [categoryName, setCategoryName] = useState('');

  // Update internal state when modal opens or category prop changes
  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    } else {
      setCategoryName('');
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onSave(categoryName);
    }
  };

  const isEdit = !!category;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layers size={24} />
            </div>
            <div>
              <h2 className="text-xl font-inter font-bold text-gray-900">
                {isEdit ? 'Update Category' : 'Add New Category'}
              </h2>
              <p className="text-sm text-gray-500 font-medium mt-1">
                {isEdit ? 'Modify the details of your category.' : 'Create a new classification for your products.'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <hr className="border-gray-50" />

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="categoryName" className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                <Tag size={12} className="text-indigo-400" />
                Category Name
              </label>
              <input
                id="categoryName"
                type="text"
                autoFocus
                placeholder="Enter category name..."
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-100 transition-all outline-none placeholder:text-gray-300"
                required
              />
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#4F46E5] text-white rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isEdit ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                isEdit ? 'Update Category' : 'Save Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
