import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Car, Smartphone, Utensils, Box } from 'lucide-react';

const IndustriesSegments = () => {
  const industries = [
    { title: "Electronic Industry", icon: <Cpu />, color: "text-blue-500" },
    { title: "Automobile Industry", icon: <Car />, color: "text-blue-600" },
    { title: "Domestic Appliances", icon: <Smartphone />, color: "text-blue-400" },
    { title: "Food Industry", icon: <Utensils />, color: "text-blue-700" }
  ];

  return (
    <section id="industries" className="py-20 bg-white overflow-hidden">
      <div className="advik-container">
        
        {/* Section Header based on Image 1 */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="bg-[#00AEEF] px-8 py-3 transform -skew-x-12">
            <h2 className="text-white text-2xl md:text-3xl font-display transform skew-x-12 m-0">
              INDUSTRIES & SEGMENTS
            </h2>
          </div>
          <div className="hidden md:block flex-grow h-[2px] bg-[#00AEEF] relative">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              className="h-full bg-[#00AEEF]"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white px-4">
              <Box size={48} className="text-[#00AEEF]" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>

        {/* Industries We Serve line */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <div className="h-[1px] w-20 md:w-40 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rotate-45 bg-gray-600"></div>
            <h3 className="text-sm md:text-base font-bold text-gray-700 uppercase tracking-widest whitespace-nowrap">
              INDUSTRIES WE SERVE
            </h3>
            <div className="w-2 h-2 rotate-45 bg-gray-600"></div>
          </div>
          <div className="h-[1px] w-20 md:w-40 bg-gray-300"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Text Content based on Image 2 and 3 */}
          <div className="lg:w-1/3 text-right">
            <motion.p 
              initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-gray-600 text-lg leading-relaxed mb-6 font-medium italic"
            >
              "Extensive domain expertise and a diligent team of professionals have enabled us to cater to the needs of various industries."
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-500 text-sm leading-relaxed"
            >
              Our long Experience in this Industries has helped us to develop an expertise to workout any type of box depending on the customers Requirement at the best possible prices.
            </motion.p>
          </div>

          {/* Industry Grid based on Image 1 */}
          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-6 w-full [perspective:1000px]">
            {industries.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, rotateX: 45, y: 30, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="bg-gray-50 p-6 flex flex-col items-center justify-center text-center group hover:bg-white hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-blue-100 rounded-lg shadow-sm"
              >
                <div className={`mb-4 transition-transform duration-300 group-hover:scale-110 ${item.color}`}>
                  {React.cloneElement(item.icon, { size: 48, strokeWidth: 1.5 })}
                </div>
                <div className="h-[2px] w-8 bg-blue-400 mb-4 group-hover:w-full transition-all duration-300 opacity-50 group-hover:opacity-100"></div>
                <h4 className="text-advik-navy font-display text-sm md:text-base leading-tight">
                  {item.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default IndustriesSegments;
