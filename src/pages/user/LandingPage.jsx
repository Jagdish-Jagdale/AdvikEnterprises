import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import AboutUs from '../../components/AboutUs';
import Services from '../../components/Services';
import ProductCircularCarousel from '../../components/ProductCircularCarousel';
import IndustriesSegments from '../../components/IndustriesSegments';
import ContactUs from '../../components/ContactUs';
import Footer from '../../components/Footer';
import { db } from '../../firebase';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';

const LandingPage = () => {
  React.useEffect(() => {
    // Synchronous check and set to prevent race conditions in React Strict Mode
    const hasVisited = sessionStorage.getItem('advik_visited');
    
    if (!hasVisited) {
      sessionStorage.setItem('advik_visited', 'true');
      
      const incrementVisitors = async () => {
        const visitorDoc = doc(db, 'site_stats', 'visitors');
        try {
          await setDoc(visitorDoc, { count: increment(1) }, { merge: true });
        } catch (error) {
          console.error("Error incrementing visitors:", error);
          // Optional: clear on error to allow retry
          // sessionStorage.removeItem('advik_visited');
        }
      };
      incrementVisitors();
    }
  }, []);

  return (
    <div className="bg-white">
      <Hero />
      <div className="px-4 md:px-12 lg:px-16 space-y-0">
        <AboutUs />
        <Services />
        <ProductCircularCarousel />
        <IndustriesSegments />
        <ContactUs />
      </div>
    </div>
  );
};

export default LandingPage;
