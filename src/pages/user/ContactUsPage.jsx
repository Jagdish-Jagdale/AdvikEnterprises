import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ChevronRight, Send, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'email' ? value.toLowerCase() : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const BROWSER_ID_KEY = 'advik_browser_id';
      const LAST_SUBMIT_KEY = 'advik_last_submit';
      const COOLDOWN_MINUTES = 10;
      const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;
      const now = new Date().getTime();

      // 1. Check Browser ID
      let browserId = localStorage.getItem(BROWSER_ID_KEY);
      if (!browserId) {
        browserId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem(BROWSER_ID_KEY, browserId);
      }

      // 2. Local Storage Timestamp Limit Check
      const lastSubmitStr = localStorage.getItem(LAST_SUBMIT_KEY);
      if (lastSubmitStr) {
        const lastSubmitTime = parseInt(lastSubmitStr, 10);
        if (now - lastSubmitTime < cooldownMs) {
          const remainingMins = Math.ceil((cooldownMs - (now - lastSubmitTime)) / 60000);
          toast.error(`Please wait ${remainingMins} minutes before sending another message.`);
          setIsSubmitting(false);
          return;
        }
      }

      // 3. Firestore Recent Submissions Check (No composite index needed)
      const q = query(
        collection(db, 'messages'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);

      let hasRecentSubmission = false;
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData.timestamp) {
          const docTime = docData.timestamp.toMillis();
          if (now - docTime < cooldownMs) {
            if (docData.email === formData.email || docData.browserId === browserId) {
              hasRecentSubmission = true;
            }
          }
        }
      });

      if (hasRecentSubmission) {
        toast.error("We have already received a message from you recently. Please try again later.");
        localStorage.setItem(LAST_SUBMIT_KEY, now.toString()); // Refresh cooldown
        setIsSubmitting(false);
        return;
      }

      // All checks passed, Save to Firestore
      await addDoc(collection(db, 'messages'), {
        ...formData,
        browserId,
        timestamp: serverTimestamp(),
        dateString: new Date().toLocaleDateString('en-GB')
      });

      localStorage.setItem(LAST_SUBMIT_KEY, now.toString());
      toast.success("Message sent successfully!");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/advik.png"
          alt="Advik Enterprises Office"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-advik-navy/60 flex items-center justify-center">
          <div className="text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-7xl font-display text-white mb-6 uppercase tracking-tight"
            >
              Contact Us
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
              <span className="text-advik-yellow">Contact Us</span>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="h-2 bg-advik-yellow mx-auto mt-6"
            ></motion.div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-12 bg-gray-50/50 -mt-16 relative z-10">
        <div className="advik-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Phone Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group bg-white p-6 md:p-8 flex items-start gap-4 md:gap-6 shadow-sm border border-gray-100/50 hover:shadow-xl transition-all duration-500"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-advik-yellow/10 flex items-center justify-center text-advik-yellow flex-shrink-0 group-hover:bg-advik-yellow group-hover:text-advik-navy transition-colors">
                <Phone className="size-6 md:size-7" />
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 font-inter text-[10px] uppercase font-bold tracking-widest">Call</p>
                <div className="text-advik-navy font-display text-sm md:text-lg">
                  <p>+91 83083 75196</p>
                  <p>+91 77559 13303</p>
                </div>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group bg-white p-6 md:p-8 flex items-start gap-4 md:gap-6 shadow-sm border border-gray-100/50 hover:shadow-xl transition-all duration-500"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-advik-yellow/10 flex items-center justify-center text-advik-yellow flex-shrink-0 group-hover:bg-advik-yellow group-hover:text-advik-navy transition-colors">
                <Mail className="size-6 md:size-7" />
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 font-inter text-[10px] uppercase font-bold tracking-widest">Email Connect</p>
                <div className="text-advik-navy font-display text-[12px] md:text-sm space-y-1">
                  <p className="break-all">info@advikenterprise.com</p>
                  <p className="break-all">marketing@advikenterprises.com</p>
                  <p className="break-all">contact.advikenterprises@gmail.com</p>
                </div>
              </div>
            </motion.div>

            {/* Address Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group bg-white p-6 md:p-8 flex items-start gap-4 md:gap-6 shadow-sm border border-gray-100/50 hover:shadow-xl transition-all duration-500"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-advik-yellow/10 flex items-center justify-center text-advik-yellow flex-shrink-0 group-hover:bg-advik-yellow group-hover:text-advik-navy transition-colors">
                <MapPin className="size-6 md:size-7" />
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 font-inter text-[10px] uppercase font-bold tracking-widest">Office Address</p>
                <p className="text-advik-navy font-display text-[12px] md:text-sm leading-relaxed">
                  Gawatewasti, Gore Industrial Estate, Gat No.440/2, Alandi Fata, Chakan, Maharashtra 410501
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Have Questions Section */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="advik-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-white shadow-2xl border-t-8 border-advik-navy overflow-hidden"
          >
            <div className="p-6 md:p-12 text-center border-b border-gray-100">
              <h3 className="text-2xl md:text-4xl font-display text-advik-navy uppercase tracking-tight">
                Have Questions? We're Here to Help!
              </h3>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 md:p-12 space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-gray-50/50 border border-gray-100 px-5 py-4 text-sm focus:outline-none focus:border-advik-yellow transition-all"
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-gray-50/50 border border-gray-100 px-5 py-4 text-sm focus:outline-none focus:border-advik-yellow transition-all"
                    required
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter Your Message Here.."
                  className="w-full bg-gray-50/50 border border-gray-100 px-5 py-4 text-sm focus:outline-none focus:border-advik-yellow transition-all resize-none"
                  maxLength="300"
                  required
                ></textarea>
                <div className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {formData.message.length} / 300
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isSubmitting}
                className="w-full bg-advik-navy text-white py-5 flex items-center justify-center gap-3 font-black uppercase tracking-[0.3em] text-xs hover:bg-advik-yellow hover:text-advik-navy transition-all duration-300 disabled:opacity-70 group"
              >
                {isSubmitting ? (
                  <>Processing... <Loader2 size={18} className="animate-spin" /></>
                ) : (
                  <>Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}


    </div>
  );
};

export default ContactUsPage;
