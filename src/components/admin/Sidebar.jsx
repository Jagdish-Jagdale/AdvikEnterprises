import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Layers,
  Package,
  MessageSquare,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'category', icon: Layers, label: 'Category', path: '/admin/category' },
    { id: 'products', icon: Package, label: 'Products', path: '/admin/products' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      {/* Mobile Overlay - Only show when expanded on mobile */}
      {isMobile && isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Floating Menu Button for mobile when collapsed */}
      {isMobile && !isExpanded && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-500 hover:text-gray-900"
        >
          <Menu size={24} />
        </button>
      )}

      <motion.aside 
        initial={false}
        animate={{ 
          width: isMobile ? (isExpanded ? 280 : 0) : (isExpanded ? 240 : 80),
          x: isMobile && !isExpanded ? '-100%' : 0
        }}
        className={`h-screen bg-[#F8F9FA] border-r border-gray-200 flex flex-col font-inter flex-shrink-0 z-50 ${isMobile ? 'fixed left-0 top-0' : 'relative'} overflow-hidden`}
      >
        {/* Toggle Button */}
        {!isMobile && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -right-3 top-8 bg-white border border-gray-200 p-1.5 rounded-full shadow-sm text-gray-500 hover:text-gray-900 z-50 transition-colors"
          >
            <ChevronLeft size={16} className={`transition-transform duration-300 ${!isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}

        {/* Sidebar Header */}
        <div className={`p-6 flex items-center justify-center h-24 whitespace-nowrap overflow-hidden relative`}>
          {isMobile && !isExpanded ? (
            <button 
              onClick={() => setIsExpanded(true)}
              className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} />
            </button>
          ) : isExpanded ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center w-full relative"
            >
              <img
                src="/AdvikEnterpriceLogo.png"
                alt="Advik Enterprises"
                className="h-16 w-auto object-contain"
              />
              {isMobile && (
                 <button onClick={() => setIsExpanded(false)} className="absolute right-0 p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                   <ChevronLeft size={20} />
                 </button>
              )}
            </motion.div>
          ) : (
            <span className="font-bold text-2xl text-[#4F46E5] tracking-tighter cursor-pointer" onClick={() => setIsExpanded(true)}>A</span>
          )}
        </div>

        <hr className={`border-gray-200 transition-all duration-300 ${isExpanded ? 'mx-8 mb-6' : 'mx-4 mb-6'}`} />

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden no-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.id === 'dashboard' && location.pathname === '/admin/dashboard');
            return (
              <div key={item.id} className="relative group/tooltip">
                <motion.button
                  whileHover={{ x: isExpanded ? 5 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setIsExpanded(false);
                  }}
                  className={`w-full group flex items-center ${isExpanded ? 'px-3' : 'justify-center'} h-11 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-[#4F46E5] text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-6">
                    <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-700'} />
                  </div>
                  <AnimatePresence mode="wait">
                    {isExpanded && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-sm font-semibold whitespace-nowrap ml-4 overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                
                {/* Tooltip for collapsed state */}
                {!isExpanded && !isMobile && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-md opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all whitespace-nowrap z-50 shadow-xl">
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 overflow-hidden mt-auto">
          <div className="relative group/tooltip">
            <motion.button
              whileHover={{ x: isExpanded ? 5 : 0, backgroundColor: "rgba(225, 29, 72, 0.08)" }}
              onClick={handleLogout}
              className={`w-full flex items-center ${isExpanded ? 'px-3' : 'justify-center'} h-11 rounded-lg text-rose-500 hover:text-rose-600 transition-all duration-200`}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-6">
                <LogOut size={20} className="text-rose-400 group-hover:text-rose-500" />
              </div>
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-semibold whitespace-nowrap ml-4 overflow-hidden"
                  >
                    Sign out
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            
            {/* Tooltip for collapsed state */}
            {!isExpanded && !isMobile && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2.5 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-md opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all whitespace-nowrap z-50 shadow-xl">
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-rose-600"></div>
                Sign out
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
