import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, limit as firestoreLimit, where } from 'firebase/firestore';

const Products = ({ limit = 10 }) => {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'), 
          where('isLanding', '==', true),
          firestoreLimit(limit)
        );
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductsData(fetchedProducts);
      } catch (error) {
        console.error("Error fetching carousel products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  useEffect(() => {
    if (isPaused || productsData.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const { scrollLeft, scrollWidth } = container;
        const oneSetWidth = scrollWidth / 2;
        
        // Calculate card width dynamically or use fixed 352
        const cardWidth = container.firstElementChild?.offsetWidth + 32 || 352;
        
        let nextPos = scrollLeft + cardWidth;

        // If next position will go deep into the second set or if we're already past halfway
        if (nextPos >= oneSetWidth + (cardWidth / 2)) {
          // Reset to beginning instantly
          container.scrollLeft = 0;
          nextPos = cardWidth;
        }
        
        container.scrollTo({ left: nextPos, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, productsData]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-advik-yellow mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-advik-navy opacity-40">Syncing Catalog...</p>
      </div>
    );
  }

  return (
    <section id="products" className="py-24 relative overflow-hidden">
      {/* Background with Image and Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad866572e276?auto=format&fit=crop&q=80&w=2000"
          alt="Industrial Background"
          className="w-full h-full object-cover opacity-10"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white"></div>
      </div>

      <div className="advik-container relative z-10">
        <div className="mb-16 border-b border-gray-100 pb-8 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-display text-advik-navy tracking-tight">Our Products</h2>
          <div className="w-20 h-1.5 bg-advik-yellow mt-4 mx-auto md:mx-0"></div>
        </div>

        <div
          className="relative group/carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {(productsData.length > 0 ? [...productsData, ...productsData] : []).map((item, i) => (
              <motion.div
                key={`${item.id}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "200px" }}
                className="min-w-[260px] sm:min-w-[280px] lg:min-w-[320px] snap-start group bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <Link to={`/products?name=${encodeURIComponent(item.name)}`}>
                  <div className="relative aspect-square overflow-hidden rounded-none bg-gray-50/50 mb-6 flex items-center justify-center p-4">
                    {/* Skeleton/Placeholder background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <img
                      src={item.image || '/noimage.png'}
                      alt={item.name}
                      onError={(e) => { e.target.src = '/noimage.png'; }}
                      loading="eager"
                      fetchPriority="high"
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-multiply relative z-10"
                    />
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex-1 pr-4">
                      <p className="text-[9px] font-bold text-advik-yellow tracking-widest uppercase mb-1 group-hover:text-advik-navy transition-colors duration-300">
                        {item.category}
                      </p>
                      <h4 className="text-advik-navy font-display text-xl leading-tight group-hover:text-advik-yellow transition-colors duration-300 uppercase truncate">
                        {item.name}
                      </h4>
                    </div>
                    <div
                      className="text-4xl font-display leading-none select-none pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                      style={{ WebkitTextStroke: '1px #1a2b3c', color: 'transparent' }}
                    >
                      {((i % productsData.length) + 1).toString().padStart(2, '0')}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
