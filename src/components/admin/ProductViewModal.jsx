import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Layers, Info } from 'lucide-react';

const ProductViewModal = ({ isOpen, onClose, product }) => {
  const [showAllDesc, setShowAllDesc] = useState(false);

  // Reset state when modal opens/changes
  useEffect(() => {
    setShowAllDesc(false);
  }, [product, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden font-inter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Info size={22} className="text-[#4F46E5]"/>
                Product Details
              </h2>
              <button 
                onClick={onClose} 
                className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 flex-shrink-0">
                   <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden relative group shadow-sm">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                      ) : (
                        <Package size={48} className="text-gray-300" />
                      )}
                   </div>
                </div>

                <div className="w-full md:w-2/3 flex flex-col gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                    <div className="inline-flex mt-3 items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-[11px] uppercase tracking-widest font-black gap-1.5">
                      <Layers size={14} />
                      {product.category}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Description</h4>
                    {product.description ? (
                      <div>
                        <ul className={`space-y-2 list-none p-0 pr-2 ${showAllDesc ? 'max-h-48 overflow-y-auto no-scrollbar' : ''}`}>
                          {product.description.split('\n').filter(line => line.trim()).slice(0, showAllDesc ? undefined : 3).map((point, i) => {
                            const trimmedPoint = point.trim();
                            const formattedPoint = trimmedPoint ? trimmedPoint.charAt(0).toUpperCase() + trimmedPoint.slice(1) : '';
                            return (
                              <li key={i} className="flex gap-2.5 items-start">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0 shadow-sm shadow-indigo-200" />
                                <span className="text-gray-600 text-sm leading-relaxed">{formattedPoint}</span>
                              </li>
                            );
                          })}
                        </ul>
                        {product.description.split('\n').filter(line => line.trim()).length > 3 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowAllDesc(!showAllDesc); }}
                            className="mt-3 text-[10px] font-black text-[#4F46E5] uppercase tracking-widest hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-md"
                          >
                            {showAllDesc ? '- Show Less' : `+ Show ${product.description.split('\n').filter(line => line.trim()).length - 3} More`}
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic">No description available.</p>
                    )}
                  </div>
                  
                  <div className="mt-auto border-t border-gray-100 pt-4 flex gap-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                     <span className="flex items-center gap-1">
                        Featured: <span className={product.isLanding ? "text-emerald-500" : "text-gray-400"}>{product.isLanding ? 'Yes' : 'No'}</span>
                     </span>
                     {product.updated && (
                       <span className="flex items-center gap-1">
                         Updated: <span className="text-gray-900">{product.updated}</span>
                       </span>
                     )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-100 font-bold tracking-wide transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductViewModal;
