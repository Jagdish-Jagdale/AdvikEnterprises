import React, { useState, useEffect } from 'react';
import AddCategoryModal from '../../components/admin/AddCategoryModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { Search, Filter, Plus, SquarePen, Trash, ArrowUpDown, Loader2 } from 'lucide-react';
import { db, storage } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [products, setProducts] = useState([]);

  // Fetch categories from Firestore
  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const sortedCats = [
        ...cats.filter(cat => cat.name?.toLowerCase() !== 'other'),
        ...cats.filter(cat => cat.name?.toLowerCase() === 'other')
      ];
      setCategories(sortedCats);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Category Sync Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch products to calculate counts
  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  // Reset to page 1 when search or rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rowsPerPage]);

  const filteredCategories = categories.filter(cat => 
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSaveCategory = async (name, imageFile) => {
    // Duplicate check
    const isDuplicate = categories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && cat.id !== selectedCategory?.id
    );

    if (isDuplicate) {
      toast.error("A category with this name already exists in the database. Please use a unique title.");
      return;
    }

    setUploading(true);
    try {
      let imageUrl = selectedCategory?.image || '';

      // Upload image if provided
      if (imageFile) {
        const storageRef = ref(storage, `categories/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const today = new Date().toLocaleDateString('en-GB');

      if (selectedCategory) {
        // Update existing
        const catRef = doc(db, 'categories', selectedCategory.id);
        await updateDoc(catRef, {
          name,
          updated: today,
          updatedAt: serverTimestamp()
        });
      } else {
        // Add new
        await addDoc(collection(db, 'categories'), {
          name,
          products: 0,
          created: today,
          updated: today,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      toast.success(selectedCategory ? "Category updated successfully!" : "Category saved successfully!");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      setUploading(true);
      // Delete document from firestore
      await deleteDoc(doc(db, 'categories', categoryToDelete.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    } finally {
      setUploading(false);
      setCategoryToDelete(null);
    }
  };

  const openDeleteModal = (cat) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-inter font-bold text-gray-900 tracking-tight mb-2 normal-case">Manage Categories</h1>
            <p className="font-inter text-gray-500 text-base font-normal max-w-2xl leading-relaxed">
              Organize your product inventory by creating and managing logical business categories.
            </p>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-lg font-bold text-sm hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Add New Category</span>
          </button>
        </div>
        
        <hr className="mb-10 border-gray-200" />

        {/* Search & Sort Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full text-indigo-100">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search categories..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-900"
               />
            </div>
           <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Sort Dropdown */}
              <div className="relative flex-1 md:flex-none">
                 <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <select className="pl-10 pr-8 py-3 bg-gray-50 border-none rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer min-w-[160px] w-full">
                    <option>Sort by Name</option>
                    <option>Sort by Created Date</option>
                    <option>Most Products</option>
                 </select>
              </div>

              {/* Rows Dropdown */}
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

        {/* Categories Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Sr No</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Products</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Created Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Last Updated</th>
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
                ) : paginatedCategories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-10 text-center text-gray-400 text-sm font-medium italic">
                      No categories found.
                    </td>
                  </tr>
                ) : paginatedCategories.map((cat, idx) => (
                  <tr key={cat.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 text-center">
                      <span className="text-gray-900 font-bold text-sm">{(currentPage - 1) * rowsPerPage + idx + 1}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-block text-gray-900 font-bold text-sm group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300 cursor-default max-w-[180px] truncate" title={cat.name}>
                        {cat.name.length > 20 ? `${cat.name.substring(0, 20)}...` : cat.name}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 bg-indigo-50 rounded-lg text-xs font-bold text-indigo-600">
                        {products.filter(p => p.category === cat.name).length} items
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-gray-500 text-xs font-medium">{cat.created}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-gray-500 text-xs font-medium">{cat.updated}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {cat.name.toLowerCase() === 'other' ? (
                          <>
                            <div className="p-2 text-gray-300 bg-gray-50 rounded-lg cursor-not-allowed" title="System Default - Cannot Edit">
                              <SquarePen size={16} />
                            </div>
                            <div className="p-2 text-gray-300 bg-gray-50 rounded-lg cursor-not-allowed" title="System Default - Cannot Delete">
                              <Trash size={16} />
                            </div>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => openEditModal(cat)}
                              className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all" 
                              title="Edit"
                            >
                              <SquarePen size={16} />
                            </button>
                            <button 
                              onClick={() => openDeleteModal(cat)}
                              className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all" 
                              title="Delete"
                            >
                              <Trash size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          {filteredCategories.length > 10 && (
            <div className="px-8 py-4 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                 Showing {Math.min(filteredCategories.length, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(filteredCategories.length, currentPage * rowsPerPage)} of {filteredCategories.length} records
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
      
      <AddCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveCategory}
        category={selectedCategory}
        loading={uploading}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory}
        itemName={categoryToDelete?.name}
        loading={uploading}
      />
    </>
  );
};

export default Category;
