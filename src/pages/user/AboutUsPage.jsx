import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ChevronRight, CheckCircle2, Box, Users, Target, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  const whyChooseUsPoints = [
    "Over 12 years of industry-leading expertise in packaging solutions.",
    "Customized packaging designed specifically for your product requirements.",
    "State-of-the-art manufacturing processes ensuring high-quality standards.",
    "Comprehensive range of primary and secondary packaging materials.",
    "Cost-effective solutions without compromising on durability or safety.",
    "Dedicated 24/7 customer support for all your logistical needs.",
    "Eco-friendly and sustainable packaging options available.",
    "On-time delivery and reliable supply chain management."
  ];

  return (
    <div className="bg-white">

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/advik.png"
          alt="Advik Enterprises Industrial Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-advik-navy/60 flex items-center justify-center">
          <div className="text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl font-display text-white mb-6 uppercase tracking-tight"
            >
              About Us
            </motion.h1>

            {/* Breadcrumbs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-2 text-white/80 text-xs font-black uppercase tracking-[0.2em]"
            >
              <Link to="/" className="hover:text-advik-yellow transition-colors">Home</Link>
              <ChevronRight size={12} className="text-advik-yellow" />
              <span className="text-advik-yellow">About Us</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 bg-white">
        <div className="advik-container">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 p-4 bg-white border-b-[20px] border-r-[20px] border-advik-yellow shadow-2xl">
                <img
                  src="/about-packaging.png"
                  alt="Packaging Solutions"
                  className="w-full h-[60vh]"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 border-t-8 border-l-8 border-advik-navy opacity-10"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-[2px] bg-advik-yellow"></div>
                <span className="text-advik-navy font-black tracking-widest text-xs uppercase">Welcome To</span>
                <div className="w-12 h-[2px] bg-advik-yellow"></div>
              </div>

              <h2 className="text-5xl md:text-6xl font-display text-advik-navy leading-tight">
                Advik <span className="text-advik-yellow underline decoration-4 underline-offset-8">Enterprises</span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                Welcome to Advik Enterprises, a trusted manufacturer and supplier of high-quality tapes and adhesive solutions. We are dedicated to providing durable, reliable, and cost-effective packaging products that cater to a variety of industries, ensuring exceptional performance and reliability. With a focus on innovation and customer satisfaction, we aim to deliver products that meet the unique needs of our diverse clientele.
              </p>

              {/* Director and stats Section */}
              <div className="pt-8 space-y-12 border-l-2 border-advik-yellow/10 pl-10 relative">
                {/* Visual accent from screenshot */}
                <div className="absolute top-8 left-0 w-[4px] h-24 bg-advik-yellow -translate-x-full"></div>
                
                <div className="flex flex-wrap gap-x-16 gap-y-10">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-advik-navy uppercase tracking-tight font-display">Bhushan Patil</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-[2px] bg-advik-yellow/30"></div>
                      <span className="text-[10px] font-black text-advik-yellow uppercase tracking-[0.4em]">Director</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-advik-navy uppercase tracking-tight font-display">Harshal Patil</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-[2px] bg-advik-yellow/30"></div>
                      <span className="text-[10px] font-black text-advik-yellow uppercase tracking-[0.4em]">Director</span>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-xl h-px bg-gray-100"></div>

                <div className="flex flex-wrap gap-x-24 gap-y-8">
                  <div className="space-y-2">
                    <p className="text-5xl font-black text-advik-navy font-display">35+</p>
                    <p className="text-[10px] font-black text-advik-yellow uppercase tracking-[0.2em]">Manufacturing</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-5xl font-black text-advik-navy font-display">100%</p>
                    <p className="text-[10px] font-black text-advik-yellow uppercase tracking-[0.2em]">Quality Driven</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customized Solutions Banner */}
      <section className="py-16 bg-advik-navy relative overflow-hidden">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-advik-yellow/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
        ></motion.div>
        <div className="advik-container relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="max-w-4xl border-l-4 border-advik-yellow pl-8"
          >
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 mb-8">
              <span className="text-advik-yellow font-black uppercase tracking-[0.2em] text-[10px]">Expertise</span>
              <Box size={14} className="text-advik-yellow" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display text-white mb-8 uppercase leading-tight italic">
              Customized <span className="text-advik-yellow">Solutions</span>
            </h2>
            <p className="text-white/70 text-xl font-inter leading-relaxed max-w-2xl">
              Our long experience in this industry has helped us to develop an expertise to workout any type of box depending on the customer's requirement at the best possible prices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gray-50">
        <div className="advik-container">
          <div className="flex flex-col lg:flex-row items-stretch gap-16">

            {/* Left: Points */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:w-3/5 space-y-12"
            >
              <div>
                <p className="text-advik-yellow font-display uppercase tracking-[0.3em] text-xs mb-3 italic font-bold">Why Choose Us</p>
                <h2 className="text-4xl md:text-5xl font-display text-advik-navy uppercase">
                  Excellence in Every <span className="text-advik-yellow">Detail.</span>
                </h2>
                <div className="w-20 h-1.5 bg-advik-yellow mt-6"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {whyChooseUsPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="mt-1 bg-white p-1 rounded-full shadow-sm group-hover:bg-advik-yellow transition-colors duration-300">
                      <CheckCircle2 size={18} className="text-advik-navy group-hover:text-white" />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed font-bold font-inter italic group-hover:text-advik-navy transition-colors">
                      {point}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-2/5 relative"
            >
              <div className="h-full min-h-[400px] relative">
                <img
                  src="/about-pack.png"
                  alt="Industrial Excellence"
                  className="w-full h-[55vh] object-cover  transition-all duration-700 border-l-[15px] border-advik-navy"
                />
                <div className="absolute inset-0 border border-advik-yellow/20 m-6"></div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-8 -left-8 bg-advik-yellow p-8 shadow-2xl hidden md:block">
                <ShieldCheck size={48} className="text-advik-navy mb-4" />
                <p className="text-advik-navy font-black italic uppercase leading-none text-2xl">Certified<br />Quality</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUsPage;
