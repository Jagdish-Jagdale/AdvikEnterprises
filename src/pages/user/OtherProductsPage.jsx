import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Package, ChevronRight } from 'lucide-react';

const OtherProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), where('category', '==', 'Other'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching 'Other' products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-advik-yellow mb-4" size={48} />
        <span className="text-sm font-black text-advik-navy uppercase tracking-widest">Loading Products...</span>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[200px] md:h-[300px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/producstback.jpeg"
          alt="Industrial Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-advik-navy/40 flex items-center">
          <div className="advik-container w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl"
            >
              <nav className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-advik-yellow/80">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={10} />
                <span className="text-white">Other Products</span>
              </nav>
              <h1 className="text-4xl md:text-6xl font-display text-white mb-4 uppercase tracking-tighter">
                Other Products
              </h1>
              <div className="w-24 h-2 bg-advik-yellow"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-20">
        <div className="advik-container">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-display text-advik-navy uppercase">No Products Found</h3>
              <p className="text-gray-500 mt-2">Check back later for new additions to our collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {products.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/products?name=${encodeURIComponent(item.name)}`}
                    className="group block relative rounded-xl p-6 shadow-sm transition-all duration-500 border border-gray-100 hover:-translate-y-2 hover:shadow-xl bg-white"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square mb-6 overflow-hidden bg-gray-50/30 rounded-lg flex items-center justify-center p-4">
                      <img
                        src={item.image || '/noimage.png'}
                        alt={item.name}
                        onError={(e) => { e.target.src = '/noimage.png'; }}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="text-center">
                       <span className="text-advik-yellow font-black text-[10px] tracking-widest uppercase mb-2 block group-hover:text-advik-navy transition-colors duration-300">
                        {item.category}
                      </span>
                      <h4 className="text-lg font-display text-advik-navy leading-tight group-hover:text-advik-yellow transition-colors duration-300 uppercase line-clamp-2 min-h-[3rem]">
                        {item.name}
                      </h4>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OtherProductsPage;
