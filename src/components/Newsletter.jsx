import React from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  return (
    <section className="py-32 bg-luxe-white">
      <div className="luxe-container">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 border-t border-luxe-dark/5 pt-32">
          
          <div className="max-w-md">
            <h2 className="text-3xl font-serif text-luxe-dark mb-6">Stay in the Loop</h2>
            <p className="text-sm text-luxe-dark/50 leading-relaxed font-medium">
               Subscribe for early access to new collections and exclusive editorial content.
            </p>
          </div>

          <div className="w-full md:w-1/2 flex items-center gap-4 border-b border-luxe-dark/10 pb-4">
             <input 
               type="email" 
               placeholder="Email Address" 
               className="bg-transparent w-full text-sm font-medium focus:outline-none placeholder:opacity-20 uppercase tracking-widest p-2" 
             />
             <button className="text-[10px] font-black uppercase tracking-[0.3em] text-luxe-gold hover:opacity-50 transition-opacity">
               Join
             </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;
