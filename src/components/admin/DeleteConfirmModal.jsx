import React from 'react';
import { AlertCircle, X, Loader2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, title = "Confirm Deletion", loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex gap-5">
            {/* Warning Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
              <AlertCircle size={24} />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-inter font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Are you sure you want to delete <span className="text-gray-900 font-bold">"{itemName}"</span>?
              </p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-4">
                This action cannot be undone.
              </p>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl text-sm font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-rose-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
