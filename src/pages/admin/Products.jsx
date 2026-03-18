import React, { useState, useEffect } from 'react';
import AddProductModal from '../../components/admin/AddProductModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import ProductViewModal from '../../components/admin/ProductViewModal';
import { Search, Plus, SquarePen, Trash, ArrowUpDown, Filter, Package, Loader2, BadgeCheck } from 'lucide-react';
import { db, storage } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [productToView, setProductToView] = useState(null);

  const openViewModal = (prod) => {
    setProductToView(prod);
    setIsViewModalOpen(true);
  };

  // Fetch products from Firestore
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Product Sync Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch categories for filter dropdown
  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      const sortedCats = [
        ...cats.filter(cat => cat.name?.toLowerCase() !== 'other'),
        ...cats.filter(cat => cat.name?.toLowerCase() === 'other')
      ];
      setCategories(sortedCats);
    }, (error) => {
      console.error("Firestore Category Sync Error:", error);
    });

    return () => unsubscribe();
  }, []);

  // Reset to page 1 when search or rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rowsPerPage, selectedCategory]);

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prod.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSaveProduct = async (productData, imageFile) => {
    setUploading(true);
    try {
      let imageUrl = selectedProduct?.image || '';

      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const today = new Date().toLocaleDateString('en-GB');

      if (selectedProduct) {
        const prodRef = doc(db, 'products', selectedProduct.id);
        await updateDoc(prodRef, {
          ...productData,
          image: imageUrl,
          updated: today,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          image: imageUrl,
          updated: today,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      toast.success(selectedProduct ? "Product updated successfully!" : "Product saved successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setUploading(true);
      // Delete image from storage if it exists
      if (productToDelete.image) {
        const imageRef = ref(storage, productToDelete.image);
        await deleteObject(imageRef).catch(err => console.error("Storage delete error:", err));
      }
      // Delete document from firestore
      await deleteDoc(doc(db, 'products', productToDelete.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    } finally {
      setUploading(false);
      setProductToDelete(null);
    }
  };

  const openDeleteModal = (prod) => {
    setProductToDelete(prod);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const toggleLandingStatus = async (prod) => {
    const featuredCount = products.filter(p => p.isLanding).length;

    // Limit to 10 featured products (Max check)
    if (!prod.isLanding && featuredCount >= 10) {
      toast.error("Maximum limit reached: You can only feature 10 products on the landing page.");
      return;
    }

    // Minimum 5 featured products (Min check)
    if (prod.isLanding && featuredCount <= 5) {
      toast.error("Minimum limit reached: At least 5 products must be featured for the landing page carousel.");
      return;
    }

    try {
      const prodRef = doc(db, 'products', prod.id);
      await updateDoc(prodRef, {
        isLanding: !prod.isLanding,
        updatedAt: serverTimestamp()
      });
      toast.success(prod.isLanding ? "Removed from Landing Page" : "Added to Landing Page");
    } catch (error) {
      console.error("Error toggling landing status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <>      
      {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-inter font-bold text-gray-900 tracking-tight mb-2 normal-case">Manage Products</h1>
            <p className="font-inter text-gray-500 text-base font-normal max-w-2xl leading-relaxed">
              View, edit, and manage your entire product catalog from a centralized inventory hub.
            </p>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-lg font-bold text-sm hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>
        
        <hr className="mb-10 border-gray-200" />

        {/* Search & Sort Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
           </div>
           <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                 <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <select 
                   value={selectedCategory}
                   onChange={(e) => setSelectedCategory(e.target.value)}
                   className="pl-10 pr-8 py-3 bg-gray-50 border-none rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer min-w-[200px] w-full"
                 >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                 </select>
              </div>

              <div className="relative flex-1 md:flex-none">
                 <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <select 
                   value={rowsPerPage}
                   onChange={(e) => setRowsPerPage(Number(e.target.value))}
                   className="pl-10 pr-8 py-3 bg-gray-50 border-none rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer min-w-[120px] w-full"
                 >
                    <option value={10}>10 Rows</option>
                    <option value={20}>20 Rows</option>
                    <option value={50}>50 Rows</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Sr No</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Image</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-10 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Records...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-10 text-center text-gray-400 text-sm font-medium italic">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((prod, idx) => (
                    <tr key={prod.id} onClick={() => openViewModal(prod)} className="group hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <td className="px-8 py-5 text-center">
                        <span className="text-gray-900 font-bold text-sm">{(currentPage - 1) * rowsPerPage + idx + 1}</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 mx-auto overflow-hidden border border-gray-100">
                           {prod.image ? (
                             <img src={prod.image || null} alt={prod.name} className="w-full h-full object-cover" />
                           ) : (
                             <Package size={18} />
                           )}
                        </div>
                      </td>
                    <td className="px-8 py-5">
                      <span className="inline-block text-gray-900 font-bold text-sm group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300 cursor-default">
                        {prod.name}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center whitespace-nowrap">
                      <span className="px-3 py-1 bg-indigo-50 rounded-lg text-xs font-bold text-indigo-600">
                        {prod.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="max-w-xs transition-all duration-300">
                        {prod.description ? (
                          <ul className="space-y-1.5 list-none p-0">
                            {prod.description.split('\n').filter(line => line.trim()).slice(0, 2).map((point, i) => {
                              const trimmedPoint = point.trim();
                              const formattedPoint = trimmedPoint ? trimmedPoint.charAt(0).toUpperCase() + trimmedPoint.slice(1) : '';
                              return (
                                <li key={i} className="flex gap-2 items-start">
                                  <span className="w-1.5 h-1.5 bg-indigo-200 rounded-full mt-1.5 flex-shrink-0" />
                                  <span className="text-gray-500 text-[11px] font-medium leading-relaxed truncate" title={formattedPoint}>
                                    {formattedPoint}
                                  </span>
                                </li>
                              );
                            })}
                            {prod.description.split('\n').filter(line => line.trim()).length > 2 && (
                              <li className="pl-3.5 text-[9px] font-black text-indigo-400 uppercase tracking-widest pt-1">
                                + {prod.description.split('\n').filter(line => line.trim()).length - 2} More Points
                              </li>
                            )}
                          </ul>
                        ) : (
                          <span className="text-gray-300 text-[10px] italic">No description</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleLandingStatus(prod); }}
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            prod.isLanding 
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 ring-1 ring-emerald-200 shadow-sm' 
                              : 'text-gray-300 bg-gray-50 hover:bg-gray-100 hover:text-gray-400'
                          }`}
                          title={prod.isLanding ? "Remove from Home Page" : "Show on Home Page"}
                        >
                          <BadgeCheck size={18} className={prod.isLanding ? "fill-emerald-600/10" : ""} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openEditModal(prod); }}
                          className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all" 
                          title="Edit"
                        >
                          <SquarePen size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openDeleteModal(prod); }}
                          className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all" 
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          {filteredProducts.length > 10 && (
            <div className="px-8 py-4 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                 Showing {Math.min(filteredProducts.length, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(filteredProducts.length, currentPage * rowsPerPage)} of {filteredProducts.length} records
               </p>
               <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-400 hover:text-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-800 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
               </div>
            </div>
          )}
        </div>
        
        <hr className="mt-10 border-gray-200" />
      
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct}
        product={selectedProduct}
        loading={uploading}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        itemName={productToDelete?.name}
        loading={uploading}
      />

      <ProductViewModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        product={productToView}
      />

    </>
  );
};

export default Products;
