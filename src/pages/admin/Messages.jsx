import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { Search, SquarePen, Trash, ArrowUpDown, Filter, Mail, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Messages = () => {
  const [messages, setMessages] = useState([]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'messages', messageToDelete.id));
      setIsDeleteModalOpen(false);
      toast.success("Message deleted successfully!");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message.");
    } finally {
      setDeleting(false);
      setMessageToDelete(null);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          sender: data.name || 'Anonymous',
          email: data.email || 'N/A',
          inquiry: data.message || '',
          date: data.timestamp ? new Date(data.timestamp.toDate()).toLocaleDateString('en-GB') : 'N/A',
          ...data
        };
      });
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages.");
    });

    return () => unsubscribe();
  }, []);

  // Reset to page 1 when search or rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rowsPerPage]);

  const filteredMessages = messages.filter(msg => 
    msg.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.inquiry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMessages.length / rowsPerPage);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const openDeleteModal = (msg, e) => {
    e.stopPropagation();
    setMessageToDelete(msg);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (msg) => {
    setSelectedMessage(msg);
    setIsViewModalOpen(true);
  };

  return (
    <>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-inter font-bold text-gray-900 tracking-tight mb-2 normal-case">Operational Messages</h1>
              <p className="font-inter text-gray-500 text-base font-normal max-w-2xl leading-relaxed">
                Stay connected with your clients and respond to inquiries from a secure communication center.
              </p>
            </div>
          </div>
          
          <hr className="mb-10 border-gray-200" />

          {/* Search & Sort Card */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                />
             </div>
             <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Sort Dropdown */}
                <div className="relative flex-1 md:flex-none">
                   <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                   <select className="pl-10 pr-8 py-3 bg-gray-50 border-none rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer min-w-[160px] w-full">
                      <option>Sort by Date</option>
                      <option>Sort by Sender</option>
                      <option>Sort by Unread</option>
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

          {/* Messages Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Sr No</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sender Name</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inquiry</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Sending Date</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedMessages.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-10 text-center text-gray-400 text-sm font-medium italic">
                        No messages found.
                      </td>
                    </tr>
                  ) : (
                    paginatedMessages.map((msg, idx) => (
                      <tr key={msg.id} onClick={() => openViewModal(msg)} className="group hover:bg-gray-50/50 transition-colors cursor-pointer">
                        <td className="px-8 py-5 text-center">
                          <span className="text-gray-900 font-bold text-sm">{(currentPage - 1) * rowsPerPage + idx + 1}</span>
                        </td>
                        <td className="px-8 py-5">
                        <span className="inline-block text-gray-900 font-bold text-sm group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300 cursor-default max-w-[200px] truncate" title={msg.sender}>
                          {msg.sender.length > 20 ? `${msg.sender.substring(0, 20)}...` : msg.sender}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-500 text-sm font-medium inline-block max-w-[250px] truncate" title={msg.email}>
                          {msg.email.length > 30 ? `${msg.email.substring(0, 30)}...` : msg.email}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-xs line-clamp-1">
                          {msg.inquiry}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-gray-500 text-xs font-medium">{msg.date}</span>
                      </td>
                        <td className="px-8 py-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={(e) => openDeleteModal(msg, e)}
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
            {filteredMessages.length > 10 && (
              <div className="px-8 py-4 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   Showing {Math.min(filteredMessages.length, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(filteredMessages.length, currentPage * rowsPerPage)} of {filteredMessages.length} records
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

      {/* View Message Modal */}
      {isViewModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 font-display flex items-center gap-2">
                <Mail className="text-indigo-600" size={20} />
                Message Details
              </h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sender</label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50/50 px-4 py-3 border border-gray-100 rounded-xl">
                    {selectedMessage.sender}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50/50 px-4 py-3 border border-gray-100 rounded-xl">
                    {selectedMessage.date}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50/50 px-4 py-3 border border-gray-100 rounded-xl">
                    {selectedMessage.email}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Inquiry / Message</label>
                  <div className="text-sm font-medium text-gray-900 bg-gray-50/50 px-4 py-3 border border-gray-100 rounded-xl whitespace-pre-wrap min-h-[120px]">
                    {selectedMessage.inquiry}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold uppercase tracking-wide rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteMessage}
        itemName={`Message from ${messageToDelete?.sender}`}
        loading={deleting}
      />


    </>
  );
};

export default Messages;
