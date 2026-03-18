import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <section id="about" className="py-20 bg-white overflow-hidden">
      <div className="advik-container">
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-[45%] space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-advik-yellow"></div>
              <span className="text-advik-navy font-black tracking-widest text-sm uppercase italic">Welcome to Advik</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display text-advik-navy leading-tight">
              Leading the Way in <br/>
              <span className="text-advik-yellow">Packaging Innovation.</span>
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              Advik Enterprises thrives at the intersection of craftsmanship and scale. We don't just supply; we engineer the foundations of your logistical success. Our commitment to quality ensures that every package handled with our materials is secured for the journey ahead.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="border-l-4 border-advik-yellow pl-4">
                <p className="text-3xl font-black text-advik-navy">12+</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Years Experience</p>
              </div>
              <div className="border-l-4 border-advik-yellow pl-4">
                <p className="text-3xl font-black text-advik-navy">24/7</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Support Line</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Video Stack */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-[55%] relative self-end lg:self-end"
          >
            <div className="relative z-10 p-4 bg-white border-b-[20px] border-r-[20px] border-advik-yellow transition-transform hover:scale-105 duration-500 shadow-2xl">
               <video 
                 src="/aboutusvid.mp4" 
                 autoPlay 
                 loop 
                 muted 
                 playsInline
                 className="w-full h-auto transition-all duration-700"
               />
            </div>
            {/* Background pattern or shape */}
            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-8 border-l-8 border-advik-navy opacity-20"></div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default AboutUs;
