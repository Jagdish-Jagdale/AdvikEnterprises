import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, limit as firestoreLimit, where } from 'firebase/firestore';

const ProductCircularCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const autoPlayRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('isLanding', '==', true),
          firestoreLimit(10)
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(fetched);
      } catch (error) {
        console.error("Error fetching carousel products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const nextSlide = () => {
    if (products.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    if (products.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  useEffect(() => {
    if (isHovered || products.length === 0) return;
    autoPlayRef.current = setInterval(nextSlide, 2000);
    return () => clearInterval(autoPlayRef.current);
  }, [isHovered, products.length]);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="animate-spin text-advik-yellow mb-4" size={48} />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-advik-navy opacity-40">Initializing 3D Gallery...</p>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section id="products" className="py-16 relative overflow-hidden bg-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
      </div>

      <div className="advik-container relative z-10">
        <div className="mb-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display text-advik-navy tracking-tight"
          >
            OUR PRODUCTS
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            className="h-1.5 bg-advik-yellow mt-4 mx-auto rounded-full"
          />
        </div>

        {/* 3D Carousel Container */}
        <div
          className="relative h-[380px] md:h-[480px] flex items-center justify-center perspective-[2000px] select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center preserve-3d">
            <AnimatePresence mode="popLayout">
              {products.map((item, index) => {
                // Calculate position relative to active index
                let relativeIndex = index - activeIndex;

                // Handle circular wrapping for smooth look
                if (relativeIndex > products.length / 2) relativeIndex -= products.length;
                if (relativeIndex < -products.length / 2) relativeIndex += products.length;
                // Math for a circular/ring path
                const radius = 1000; // Balanced radius for depth
                const angle = relativeIndex * (Math.PI / 8.5); // Refined spread for perfect gap

                const x = Math.sin(angle) * radius;
                const z = (Math.cos(angle) * radius) - radius; // Pull back
                const rotateY = relativeIndex * -22;
                const opacity = Math.abs(relativeIndex) > 2 ? 0 : 1 - Math.abs(relativeIndex) * 0.35;
                const scale = 1 - Math.abs(relativeIndex) * 0.12;

                const isActive = index === activeIndex;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, x: 0, z: -1000 }}
                    animate={{
                      opacity,
                      scale,
                      x,
                      z,
                      rotateY,
                      zIndex: 10 - Math.abs(relativeIndex)
                    }}
                    whileHover={isActive ? { scale: scale * 1.05, z: z + 50, y: -15 } : {}}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 20,
                      mass: 1
                    }}
                    className="absolute w-[260px] sm:w-[320px] h-[380px] md:h-[460px] cursor-pointer"
                    onClick={() => {
                      if (isActive) {
                        navigate(`/products?name=${encodeURIComponent(item.name)}`);
                      } else {
                        setActiveIndex(index);
                      }
                    }}
                  >
                    <div className={`w-full h-full bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border ${isActive ? 'border-advik-yellow/30 shadow-advik-yellow/10' : 'border-gray-100/50'} p-8 flex flex-col group overflow-hidden relative backdrop-blur-md`}>
                      {/* Premium Glow for active card */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-b from-advik-yellow/5 to-transparent pointer-events-none" />
                      )}

                      {/* Product Image Container */}
                      <div className="relative flex-1 bg-[#FDFDFD] rounded-2xl mb-8 overflow-hidden flex items-center justify-center p-10 group-hover:bg-white transition-all duration-500 shadow-inner">
                        <img
                          src={item.image || '/noimage.png'}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 relative z-10"
                        />
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[11px] font-black tracking-[0.3em] text-advik-yellow uppercase block font-inter">
                            {item.category}
                          </span>
                          <h3 className="text-xl md:text-2xl font-display text-advik-navy uppercase truncate">
                            {item.name}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between pointer-events-auto">
                          <Link
                            to={`/products?name=${encodeURIComponent(item.name)}`}
                            className="text-xs font-black text-advik-navy hover:text-advik-yellow flex items-center gap-2 transition-all uppercase tracking-wider group/link"
                          >
                            Explore Details
                            <span className="w-6 h-6 rounded-full bg-advik-navy/5 flex items-center justify-center group-hover/link:bg-advik-yellow group-hover/link:text-white transition-colors">
                              <ChevronRight size={14} />
                            </span>
                          </Link>
                          <div
                            className="text-4xl font-display transition-all duration-500 opacity-20 group-hover:opacity-60 select-none"
                            style={{
                              WebkitTextStroke: '1px #1a2b3c',
                              color: 'transparent',
                              fontFamily: 'inherit'
                            }}
                          >
                            {(index + 1).toString().padStart(2, '0')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Controls Overlay */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden md:flex justify-between px-4 md:px-12 pointer-events-none">
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="p-3 bg-white/80 backdrop-blur shadow-xl rounded-full text-advik-navy hover:bg-advik-yellow hover:text-white transition-all active:scale-90 pointer-events-auto border border-gray-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="p-3 bg-white/80 backdrop-blur shadow-xl rounded-full text-advik-navy hover:bg-advik-yellow hover:text-white transition-all active:scale-90 pointer-events-auto border border-gray-100"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center items-center gap-3 mt-8 bg-gray-50/50 backdrop-blur-sm px-6 py-3 rounded-full w-fit mx-auto border border-white">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`transition-all duration-500 rounded-full h-1.5 ${activeIndex === i
                ? 'w-8 bg-advik-yellow shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                : 'w-1.5 bg-gray-300 hover:bg-gray-400 opacity-50'
                }`}
            />
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </section>
  );
};

export default ProductCircularCarousel;
