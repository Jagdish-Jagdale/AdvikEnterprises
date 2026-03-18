import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const ScaleInText = ({ text, className, delayOffset = 0 }) => {
  return (
    <div className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: delayOffset + i * 0.04,
            type: 'spring',
            stiffness: 150,
            damping: 10
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};

const StaggeredBlurIn = ({ text, className, delayOffset = 0 }) => {
  return (
    <div className={className}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.8,
            delay: delayOffset + i * 0.2,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="inline-block mr-[0.2em]"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

const Hero = () => {
  const images = [
    "/Hero1.png",
    "/Hero2.png",
    "/Hero3.jpeg",
    "/Hero4.jpeg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Preload images for maximum speed
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000); // Slightly slower for more premium feel
    return () => clearInterval(timer);
  }, [images]);

  return (
    <section id="home" className="relative h-[35vh] sm:h-[60vh] md:h-[94vh] min-h-[300px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for smoother feel
            }}
            className="absolute inset-0 w-full h-full object-cover object-center"
            alt={`Slide ${currentIndex + 1}`}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      <div className="advik-container relative z-20 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <ScaleInText
            text="ADVIK ENTERPRISES"
            className="text-3xl sm:text-6xl md:text-7xl font-display text-advik-yellow leading-none mb-2 sm:mb-4 tracking-tighter drop-shadow-2xl"
            delayOffset={0.4}
          />
          <StaggeredBlurIn
            text="Complete Packaging Solutions"
            className="text-xl sm:text-3xl md:text-5xl font-display text-white leading-tight mb-6 sm:mb-8 drop-shadow-lg uppercase"
            delayOffset={1.4}
          />
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute inset-x-0 bottom-10 z-30 flex justify-center gap-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${currentIndex === index ? 'bg-advik-yellow w-8' : 'bg-white/30 hover:bg-white/50'
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
