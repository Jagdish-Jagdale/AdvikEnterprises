import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronRight, Download, MessageSquare, Plus } from 'lucide-react';

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const productName = searchParams.get('name');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(false); // Set to false initially so we can re-trigger loading state correctly
      setLoading(true);
      try {
        let currentCategory = '';
        // Fetch current product by name
        if (productName) {
          const q = query(collection(db, 'products'), where('name', '==', productName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            const productData = { id: docSnap.id, ...docSnap.data() };
            setProduct(productData);
            currentCategory = productData.category;
          } else {
            setProduct(null);
          }
        }

        // Fetch all products for "Our Product Range" based on current category
        let prodsQuery;
        if (currentCategory) {
          prodsQuery = query(collection(db, 'products'), where('category', '==', currentCategory));
        } else {
          prodsQuery = query(collection(db, 'products'));
        }
        
        const prodsSnap = await getDocs(prodsQuery);
        const allProds = prodsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.name !== productName); // Exclude current

        // Shuffle and pick 10
        const shuffled = allProds.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 10));

      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [productName]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-advik-yellow mb-4" size={48} />
        <span className="text-sm font-black text-advik-navy uppercase tracking-widest">Loading Product...</span>
      </div>
    );
  }

  if (!product && !loading && productName) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <h2 className="text-3xl font-display text-advik-navy mb-4 uppercase">Product Not Found</h2>
        <p className="text-gray-500 mb-8">The product you're looking for might have been moved or deleted.</p>
        <Link to="/" className="bg-advik-navy text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-advik-yellow hover:text-advik-navy transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  // Redirect catalog view (No product name)
  if (!productName && !loading) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-white">

      {/* Hero Section with Industrial Background */}
      <section className="relative h-[250px] md:h-[350px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/Contactbg.jpeg"
          alt="Industrial Background"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-advik-navy/40 flex items-center">
          <div className="advik-container w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <nav className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-advik-yellow/80">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={10} />
                <span className="text-white">{product.category}</span>
              </nav>
              <h1 className="text-4xl md:text-7xl font-display text-white mb-4 uppercase tracking-tighter">
                {product.category || 'Product'}
              </h1>
              <div className="w-24 h-2 bg-advik-yellow"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Detail Section */}
      <section
        className="py-20 border-b border-gray-50 relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.25)), url(/productsbg.png)',
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="advik-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: Product Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center min-h-[300px]"
            >
              <div className="relative w-full max-w-[40%] aspect-square flex items-center justify-center bg-gray-50/50 rounded-2xl overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-100/50 to-gray-50 animate-pulse"></div>
                <img
                  src={product.image || '/noimage.png'}
                  alt={product.name}
                  onLoad={() => setMainImageLoaded(true)}
                  onError={(e) => { e.target.src = '/noimage.png'; }}
                  className={`relative z-10 w-full h-full object-contain mix-blend-multiply transition-opacity duration-1000 ${mainImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <h3 className="mt-6 text-xl md:text-2xl font-display text-advik-navy uppercase tracking-widest text-center opacity-80">
                {product.name}
              </h3>
            </motion.div>

            {/* Right: Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Description Header */}
              <div className="inline-block bg-advik-yellow px-12 py-3 mb-8 rounded-md">
                <span className="text-sm font-black text-advik-navy uppercase tracking-[0.2em]">Description</span>
              </div>

              {/* Info Section */}
              <div className="text-gray-600 mb-10 leading-relaxed">
                <div className="mb-6">
                  {product.description ? (
                    (() => {
                      const points = product.description.split('\n').filter(line => line.trim());
                      if (points.length === 0) return null;

                      const hasMore = points.length > 4;
                      const displayedPoints = showFullDesc ? points : points.slice(0, 4);

                      return (
                        <>
                          <ul className="space-y-6 list-none p-0 mb-0">
                            {displayedPoints.map((line, i) => {
                              const trimmedLine = line.trim();
                              const formattedLine = trimmedLine ? trimmedLine.charAt(0).toUpperCase() + trimmedLine.slice(1) : '';
                              return (
                                <li key={i} className="flex gap-4 items-start">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                  <span className="flex-1 text-[15px] text-gray-700 font-medium font-inter leading-relaxed">{formattedLine}</span>
                                </li>
                              );
                            })}
                          </ul>

                          {hasMore && (
                            <button
                              onClick={() => setShowFullDesc(!showFullDesc)}
                              className="mt-8 text-advik-navy hover:text-advik-yellow font-black text-xs uppercase tracking-[0.2em] border-b-2 border-advik-navy/30 hover:border-advik-yellow transition-all py-1 flex items-center gap-2"
                            >
                              {showFullDesc ? 'Show Less' : 'Show More'}
                            </button>
                          )}
                        </>
                      );
                    })()
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-50/50 rounded-2xl border border-gray-100/50 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                        <Plus className="rotate-45" size={24} />
                      </div>
                      <p className="text-gray-400 italic font-inter text-sm max-w-[250px]">Detailed specifications for this product are currently being compiled.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Product Range Section */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-gray-50/50">
          <div className="advik-container">
            <div className="text-center mb-16">
              <div className="inline-block bg-advik-yellow px-12 py-3 mb-4 rounded-md">
                <span className="text-sm font-black text-advik-navy uppercase tracking-[0.2em]">Our Product Range</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {relatedProducts.slice(0, 10).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/products?name=${encodeURIComponent(item.name)}`}
                    className="group block relative rounded-xl p-5 shadow-sm transition-all duration-500 border border-gray-100 hover:-translate-y-2"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square mb-6 rounded-none overflow-hidden bg-transparent flex items-center justify-center p-6">
                      <img
                        src={item.image || '/noimage.png'}
                        alt={item.name}
                        onError={(e) => { e.target.src = '/noimage.png'; }}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="px-2 pb-2 relative">
                      <span className="text-advik-yellow font-black text-[10px] tracking-widest uppercase mb-1 block group-hover:text-advik-navy transition-colors duration-300">
                        {item.category || 'Product'}
                      </span>
                      <h4 className="text-xl font-display text-advik-navy leading-tight group-hover:text-advik-yellow transition-colors duration-300 uppercase break-words">
                        {item.name}
                      </h4>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductPage;
