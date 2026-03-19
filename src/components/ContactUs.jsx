import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

const ContactUs = () => {
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
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 overflow-hidden">
      <div className="advik-container">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-8"
          >
            <div>
              <p className="text-advik-yellow font-black uppercase tracking-[0.3em] text-xs mb-2">Get In Touch</p>
              <h2 className="text-4xl font-display text-advik-navy">Contact Details</h2>
              <div className="w-16 h-1 bg-advik-yellow mt-4"></div>
            </div>

            <div className="space-y-6 pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white flex items-center justify-center text-advik-navy shadow-sm border border-gray-100">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-display text-sm text-advik-navy mb-1">Corporate Office</p>
                  <p className="text-gray-500 text-sm max-w-xs">Gat No.440-/2, Pune-nashik Highway, Near alandi Phata, Tal-khed, Dist Pune - 410501, Maharashtra, India.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white flex items-center justify-center text-advik-navy shadow-sm border border-gray-100">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-display text-sm text-advik-navy mb-1"> Call</p>
                  <p className="text-gray-500 text-sm">+91 83083 75196</p>
                  <p className="text-gray-500 text-sm">+91 77559 13303</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white flex items-center justify-center text-advik-navy shadow-sm border border-gray-100">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-display text-sm text-advik-navy mb-1">Email Connect</p>
                  <div className="text-gray-500 text-sm space-y-1">
                    <p>info@advikgroups.com</p>
                    <p>marketing@advikgroups.com</p>
                    <p>sales@advikgroups.com</p>
                    <p >contact.advikenterprises@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 bg-white p-10 shadow-2xl border-t-8 border-advik-navy"
          >
            <h3 className="text-2xl font-display text-advik-navy mb-8">Have Questions? We're Here to Help!</h3>
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-advik-yellow transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-advik-yellow transition-all"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter Your Message Here.."
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-advik-yellow transition-all resize-none"
                  maxLength="300"
                  required
                ></textarea>
                <div className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {formData.message.length} / 300
                </div>
              </div>
              <button
                disabled={isSubmitting}
                className="md:col-span-2 btn-navy py-4 flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>Processing... <Loader2 size={18} className="animate-spin" /></>
                ) : (
                  <>Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                )}
              </button>
            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default ContactUs;
