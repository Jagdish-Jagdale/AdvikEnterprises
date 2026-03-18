import React from 'react';
import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    { title: "Bopp Tapes", image: "/bopp-tapes.png", desc: "High-quality Bopp tapes for all your industrial packaging needs." },
    { title: "Pallets", image: "/pallets.png", desc: "High-durability industrial pallets designed for heavy-duty logistics." },
    { title: "Stretch Film", image: "/strech-film.jpeg", desc: "Superior stretch film for secure pallet wrapping and transit." },
    { title: "Bubble Rolls", image: "/Bubble-rolls.jpeg", desc: "Premium bubble roll solutions for maximum transit protection." }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="advik-container">

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-advik-yellow font-black uppercase tracking-[0.3em] text-xs mb-2">Our Specializations</p>
          <h2 className="text-4xl md:text-5xl font-display text-advik-navy">Complete Packaging Solutions</h2>
          <div className="w-24 h-1 bg-advik-yellow mx-auto mt-6"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                delay: i * 0.15
              }}
              className="bg-white p-8 border-b-4 border-gray-100 hover:border-advik-yellow shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center rounded-xl"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-2 border-gray-50 group-hover:border-advik-yellow transition-all duration-300 overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xl font-display text-advik-navy mb-4 group-hover:text-advik-yellow transition-colors">{s.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;
