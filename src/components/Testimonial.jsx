import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const Testimonial = () => {
  return (
    <section className="py-48 bg-white border-y border-luxe-beige relative overflow-hidden">
      
      {/* Decorative Warm Accent */}
      <div className="absolute left-1/2 top-10 -translate-x-1/2 text-luxe-gold opacity-30">
        <Quote size={40} />
      </div>

      <div className="luxe-container flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="max-w-4xl"
        >
          <p className="text-3xl md:text-5xl font-serif text-luxe-dark leading-snug tracking-tight mb-16">
            "The attention to detail and the sheer quality of the materials is unlike anything else on the market. These pieces don't just furnish a room; <span className="italic">they define its character.</span>"
          </p>
          
          <div className="flex flex-col items-center">
             <span className="text-[10px] uppercase font-black tracking-[0.5em] text-luxe-gold mb-4">DELUCA PACKAGING GROUP</span>
             <span className="text-[8px] uppercase tracking-[0.4em] opacity-40 font-bold">Industrial Designer, NYC</span>
          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default Testimonial;
