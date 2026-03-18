import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null); // Track single active category in mobile
  const productsDropdownRef = React.useRef(null);

  const toggleCategory = (catName) => {
    setActiveMobileCategory(prev => prev === catName ? null : catName);
  };

  React.useEffect(() => {
    // Fetch Categories
    const qCat = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubscribeCat = onSnapshot(qCat, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedCats = [
        ...cats.filter(cat => cat.name?.toLowerCase() !== 'other'),
        ...cats.filter(cat => cat.name?.toLowerCase() === 'other')
      ];
      setCategories(sortedCats);
    });

    // Fetch Products
    const qProd = query(collection(db, 'products'), orderBy('name', 'asc'));
    const unsubscribeProd = onSnapshot(qProd, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(prods);
    });

    return () => {
      unsubscribeCat();
      unsubscribeProd();
    };
  }, []);

  React.useEffect(() => {
    const handleTrigger = () => {
      // Open the dropdown
      setIsProductsHovered(true);
      // If it's mobile, also open the menu
      setIsOpen(true);

      // Optional: highlight first category or just let it be
      // setActiveCategory(categories[0]?.name);

      // Scroll to top just in case the event didn't handle it or to be sure
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('triggerNavbarProducts', handleTrigger);

    // Click outside handler to close dropdown
    const handleClickOutside = (e) => {
      // ONLY handle click-outside for the mega-menu on Desktop (>= 1024px)
      // On mobile, the menu is controlled exclusively by the isOpen and isProductsHovered states
      if (window.innerWidth >= 1024) {
        if (productsDropdownRef.current && !productsDropdownRef.current.contains(e.target)) {
          setIsProductsHovered(false);
          setActiveCategory(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('triggerNavbarProducts', handleTrigger);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categories, isOpen]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const menuItems = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT US', href: '/about' },
    { name: 'PRODUCTS', href: '/products', hasDropdown: true },
    { name: 'REVIEWS', href: '/reviews' },
    { name: 'CONTACT US', href: '/contact' }
  ];

  const NavLink = ({ item, mobile = false, forceActive = false }) => {
    const isRoot = item.href === '/';

    if (item.hasDropdown) {
      return (
        <span
          onClick={item.href === '/products' ? item.onClick : undefined}
          className={mobile
            ? `text-sm font-bold tracking-widest transition-colors cursor-pointer ${forceActive ? 'text-advik-yellow' : 'text-white hover:text-advik-yellow'}`
            : `text-[13px] font-extrabold tracking-widest flex items-center gap-1 transition-colors cursor-pointer ${forceActive ? 'text-advik-yellow' : 'text-advik-navy hover:text-advik-yellow'}`
          }
        >
          {item.name}
        </span>
      );
    }

    return (
      <Link
        to={item.href}
        onClick={() => mobile && setIsOpen(false)}
        className={mobile
          ? "text-white text-sm font-bold tracking-widest hover:text-advik-yellow transition-colors"
          : "text-advik-navy text-[13px] font-extrabold tracking-widest hover:text-advik-yellow flex items-center gap-1 transition-colors"
        }
      >
        {item.name}
      </Link>
    );
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 1,
        duration: 0.8
      }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="advik-container">
        <div className="flex items-center justify-between h-16 relative w-full">

          {/* Logo - Left-aligned on Mobile and Desktop */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 pl-4 lg:pl-0 lg:ml-8">
            <img
              src="/AdvikTitle.png"
              alt="Advik Enterprises"
              className="h-8 sm:h-7 w-auto"
            />
            <img
              src="/advilogotext.png"
              alt="Advik Logo"
              className="h-7 sm:h-7 w-auto"
            />

          </Link>

          {/* Desktop Menu - Aligned to the Center */}
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-10 h-full">
            {menuItems.map((item, i) => {
              const isActive = location.pathname === item.href;

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    delay: 0.3 + i * 0.08
                  }}
                  className="h-full flex items-center"
                  ref={item.hasDropdown ? productsDropdownRef : null}
                >
                  <div className="relative group py-1 h-full flex items-center">
                    <div
                      className="relative flex items-center gap-1 cursor-pointer"
                      onClick={() => item.hasDropdown && setIsProductsHovered(!isProductsHovered)}
                    >
                      <NavLink
                        item={{
                          ...item,
                          onClick: () => item.hasDropdown && setIsProductsHovered(!isProductsHovered)
                        }}
                        forceActive={isActive || (item.hasDropdown && isProductsHovered)}
                      />
                      {item.hasDropdown && (
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isProductsHovered ? 'rotate-180 text-advik-yellow' : isActive ? 'text-advik-yellow' : 'text-advik-navy group-hover:text-advik-yellow'}`} />
                      )}
                      {/* Horizontal line under active/hover */}
                      <div className={`absolute -bottom-1.5 left-0 h-0.5 bg-advik-yellow transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
                    </div>

                    {/* Mega Menu Dropdown */}
                    {item.hasDropdown && (
                      <AnimatePresence>
                        {isProductsHovered && (
                          <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-[140px] flex items-start z-50">
                            {/* Categories Card */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="w-[280px] bg-white border border-gray-100 shadow-xl rounded-none divide-y divide-gray-200"
                            >
                              {categories.map((cat) => {
                                const isOther = cat.name?.toLowerCase() === 'other';
                                const hasProducts = products.some(p => p.category === cat.name);

                                const content = (
                                  <div
                                    onMouseEnter={() => setActiveCategory(cat.name)}
                                    className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest cursor-pointer flex items-center justify-between transition-colors ${activeCategory === cat.name ? 'bg-[#FFC107] text-white' : 'text-advik-navy hover:bg-[#FFC107] hover:text-white group/cat'}`}
                                  >
                                    <span>{cat.name}</span>
                                    {!isOther && hasProducts && (
                                      <Plus size={14} className={`ml-2 transition-colors ${activeCategory === cat.name ? 'text-white' : 'text-advik-navy group-hover/cat:text-white'}`} />
                                    )}
                                  </div>
                                );

                                return isOther ? (
                                  <Link key={cat.id} to="/other-products" onClick={() => setIsProductsHovered(false)}>
                                    {content}
                                  </Link>
                                ) : (
                                  <div key={cat.id}>
                                    {content}
                                  </div>
                                );
                              })}
                            </motion.div>

                            {/* Products Card - Dynamic Fly-out Alignment */}
                            <AnimatePresence mode="wait">
                              {activeCategory && activeCategory.toLowerCase() !== 'other' && products.some(p => p.category === activeCategory) && (
                                <motion.div
                                  key={activeCategory}
                                  initial={{ opacity: 0, x: -5, y: 5 }}
                                  animate={{ opacity: 1, x: 0, y: 0 }}
                                  exit={{ opacity: 0, x: -5, y: 5 }}
                                  style={{
                                    marginTop: `${Math.max(0, categories.findIndex(c => c.name === activeCategory) * 36)}px`
                                  }}
                                  className="w-[320px] bg-white border border-gray-100 shadow-xl rounded-none divide-y divide-gray-200 overflow-y-auto max-h-[400px] z-50 ml-[-1px]"
                                >
                                  {products
                                    .filter(p => p.category === activeCategory)
                                    .map((prod) => (
                                      <Link
                                        key={prod.id}
                                        to={`/products?name=${encodeURIComponent(prod.name)}`}
                                        onClick={() => setIsProductsHovered(false)}
                                        className="block px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#212529] hover:bg-[#FFC107] hover:text-white transition-colors"
                                      >
                                        {prod.name}
                                      </Link>
                                    ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Search Bar - Right Side */}
          <div className="hidden lg:flex items-center ml-auto">
            <div className={`relative flex items-center transition-all duration-300 ${isSearchFocused ? 'w-80' : 'w-56'}`}>
              <Search className={`absolute left-3 transition-colors ${isSearchFocused ? 'text-advik-yellow' : 'text-gray-400'}`} size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-[12px] focus:outline-none focus:ring-1 focus:ring-advik-yellow transition-all"
              />

              <AnimatePresence>
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden z-[60]"
                  >
                    <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                      {products
                        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .slice(0, 8)
                        .map(prod => (
                          <Link
                            key={prod.id}
                            to={`/products?name=${encodeURIComponent(prod.name)}`}
                            onClick={() => {
                              setSearchQuery('');
                              setIsSearchFocused(false);
                            }}
                            className="block px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-advik-navy hover:bg-advik-yellow/10 transition-colors"
                          >
                            {prod.name}
                          </Link>
                        ))
                      }
                      {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="px-5 py-3 text-[10px] text-gray-400 uppercase tracking-widest italic">
                          No results found
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle - Right Side */}
          <div className="flex items-center lg:hidden pr-4 ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-advik-yellow"
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-advik-navy border-t border-white/10 overflow-hidden shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
          >
            <div className="advik-container py-6 flex flex-col space-y-4">
              {menuItems.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <NavLink
                      item={{
                        ...item,
                        onClick: () => item.hasDropdown && setIsProductsHovered(!isProductsHovered)
                      }}
                      mobile={true}
                    />
                    {item.hasDropdown && (
                      <button
                        onClick={() => setIsProductsHovered(!isProductsHovered)}
                        className="text-advik-yellow"
                      >
                        <ChevronDown size={20} className={`transition-transform duration-300 ${isProductsHovered ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {item.hasDropdown && isProductsHovered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pl-4 py-4 flex flex-col gap-4"
                    >
                      {categories.map((cat) => {
                        const hasProducts = products.some(p => p.category === cat.name);
                        const isExpanded = activeMobileCategory === cat.name;
                        const isOther = cat.name?.toLowerCase() === 'other';

                        return (
                          <div key={cat.id} className="flex flex-col gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isOther) {
                                  setIsOpen(false);
                                  window.location.href = '/other-products';
                                } else if (hasProducts) {
                                  toggleCategory(cat.name);
                                }
                              }}
                              className={`flex items-center justify-between w-full text-left ${hasProducts || isOther ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                              <span className="text-[10px] font-black text-advik-yellow uppercase tracking-widest">{cat.name}</span>
                              {!isOther && hasProducts && (
                                <Plus
                                  size={14}
                                  className={`text-advik-yellow transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`}
                                />
                              )}
                            </button>

                            <AnimatePresence>
                              {isExpanded && hasProducts && !isOther && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="flex flex-col pl-4 border-l border-white/10 gap-2 overflow-hidden"
                                >
                                  {products
                                    .filter(p => p.category === cat.name)
                                    .map(prod => (
                                      <Link
                                        key={prod.id}
                                        to={`/products?name=${encodeURIComponent(prod.name)}`}
                                        onClick={() => setIsOpen(false)}
                                        className="text-white/60 text-xs hover:text-white py-1"
                                      >
                                        {prod.name}
                                      </Link>
                                    ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
