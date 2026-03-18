import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-advik-navy py-16 text-white overflow-hidden relative">
      <div className="advik-container">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between gap-y-12 gap-x-8 border-b border-white/10 pb-12"
        >
          <motion.div variants={itemVariants} className="space-y-6 lg:w-1/3 max-w-sm">
            <div className="inline-block">
              <img src="/AdvikFooter.png" alt="Advik Enterprises Logo" className="h-26 w-auto drop-shadow-lg" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Welcome to the world of Advik Enterprises, your destination for complete packaging solutions. We specialize in high-quality, customized packaging products including paper corrugated boxes, LDPE polybags, and BOPP tapes for various industries.            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.instagram.com/advik_enterprises._?igsh=ZWVsbWNobXc2NGhl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-advik-yellow hover:text-advik-navy transition-all duration-300"
              >
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-advik-yellow hover:text-advik-navy transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-advik-yellow hover:text-advik-navy transition-all duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:w-auto lg:pt-8">
            <h4 className="font-display text-advik-yellow mb-4 uppercase tracking-widest text-sm font-bold">Explore</h4>
            <div className="h-px bg-white/10 w-full mb-6" />
            <ul className="space-y-3 text-[13px] text-gray-400 list-none font-bold tracking-wide">
              <li>
                <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-advik-yellow transition-colors uppercase">Home</Link>
              </li>
              <li>
                <Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-advik-yellow transition-colors uppercase">About Us</Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Give it a small delay for the scroll to reach top if needed, 
                    // or just fire it immediately and let Navbar handle it.
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('triggerNavbarProducts'));
                    }, 100);
                  }}
                  className="hover:text-advik-yellow transition-colors uppercase text-left"
                >
                  Products
                </button>
              </li>
              <li>
                <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-advik-yellow transition-colors uppercase">Contact Us</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-advik-yellow transition-colors border-t border-white/5 pt-2 mt-2 inline-block uppercase">Admin Login</Link>
              </li>
            </ul>
          </motion.div>


          <motion.div variants={itemVariants} className="lg:w-auto lg:pt-8 lg:pl-4">
            <h4 className="font-display text-advik-yellow mb-4 uppercase tracking-widest text-sm font-bold">Contact Us</h4>
            <div className="h-px bg-white/10 w-full mb-6" />
            
            <div className="space-y-6">
              <div>
                <h5 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Directors</h5>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white uppercase tracking-wide">Bhushan Patil</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">(Director)</span>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1 font-medium italic">
                      <p>+91 83083 75196</p>
                      <p>+91 77559 13303</p>
                      <a href="mailto:bhushan@advikenterprises.com" className="hover:text-advik-yellow block truncate">bhushan@advikenterprises.com</a>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white uppercase tracking-wide">Harshal Patil</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">(Director)</span>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1 font-medium italic">
                      <p>+91 80076 76531</p>
                      <a href="mailto:harshal@advikenterprises.com" className="hover:text-advik-yellow block truncate">harshal@advikenterprises.com</a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Official Mail</h5>
                <ul className="space-y-2 text-xs text-gray-400 font-medium list-none italic">
                  <li className="flex items-center gap-2">
                    <Mail size={14} className="text-advik-yellow shrink-0" />
                    <a href="mailto:info@advikenterprise.com" className="hover:text-advik-yellow truncate">info@advikenterprise.com</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail size={14} className="text-advik-yellow shrink-0" />
                    <a href="mailto:marketing@advikenterprises.com" className="hover:text-advik-yellow truncate">marketing@advikenterprises.com</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail size={14} className="text-advik-yellow shrink-0" />
                    <a href="mailto:contact.advikenterprises@gmail.com" className="hover:text-advik-yellow truncate text-[10px]">contact.advikenterprises@gmail.com</a>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:w-1/4 lg:pt-8 min-w-[200px]">
            <h4 className="font-display text-advik-yellow mb-4 uppercase tracking-widest text-sm font-bold">Location</h4>
            <div className="h-px bg-white/10 w-full mb-6" />
            <div className="space-y-5">
              <div className="pb-4 border-b border-white/10">
                <div className="flex gap-3 text-xs text-gray-400 font-medium items-start italic leading-relaxed">
                  <MapPin size={18} className="text-advik-yellow shrink-0 mt-0.5" />
                  <span>Gawatewasti, Gore Industrial Estate, Gat No.440/2, Alandi Fata, Chakan, Maharashtra 410501</span>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/nAJzFKiUTwDVoDcm6?g_st=awb"
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden border border-white/10 shadow-xl rounded-lg hover:border-advik-yellow/50 transition-all duration-300 aspect-video group"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3778.4296540583623!2d73.8582222!3d18.734336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c99c768b14ed%3A0xd7faa8684cc7acf!2sADVIK%20ENTERPRISES!5e0!3m2!1sen!2sin!4v1773385777092!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, pointerEvents: 'none' }}
                  allowFullScreen=""
                  loading="lazy"
                  className="transition-all duration-500 scale-105 group-hover:scale-110"
                ></iframe>
              </a>
            </div>
          </motion.div>

        </motion.div>


        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center pt-8 text-[10px] font-bold uppercase tracking-widest text-gray-500"
        >
          <p>© {new Date().getFullYear()} ADVIK ENTERPRISES. ALL RIGHTS RESERVED.</p>
          <p className="mt-4 md:mt-0">DEVELOPED BY INFOYASHONAND
            TECHNOLOGY PVT. LTD.</p>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;
