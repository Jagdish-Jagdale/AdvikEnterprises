import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReviewsPage = () => {
  const reviewScreenshots = [
    { id: 1, src: "/review-pranav.png", alt: "Pranav Deshmukh Review" },
    { id: 2, src: "/review-kalpesh.png", alt: "Kalpesh Patil Review" },
    { id: 3, src: "/review-chintamani.png", alt: "Chintamani Review" },
    { id: 4, src: "/review-sanjam.png", alt: "Sanjam Patil Review" },
    { id: 5, src: "/review-vaishnavi.png", alt: "Vaishnavi Patil Review" },
    { id: 6, src: "/review-pradip.png", alt: "Pradip Shinde Review" },
    { id: 7, src: "/review-sunil.png", alt: "Sunil Barde Review" },
    { id: 8, src: "/review-tanish.png", alt: "Tanish Mahajan Review" },
    { id: 9, src: "/review-new-1.png", alt: "Sneha Patil Review" },
    { id: 10, src: "/review-new-2.png", alt: "Vishal Beldar Review" },
    { id: 11, src: "/review-new-3.png", alt: "Akshay Mahajan Review" },
    { id: 12, src: "/review-new-4.png", alt: "Pankaj Khot Review" },
    { id: 13, src: "/review-new-5.png", alt: "Adesh Aghav Review" },
    { id: 14, src: "/review-new-6.png", alt: "Ganesh Pardeshi Review" },
    { id: 15, src: "/review-new-7.png", alt: "Payal patil Review" },
    { id: 16, src: "/review-new-8.png", alt: "Chetan Patil Review" },
    { id: 17, src: "/review-new-9.png", alt: "Sohan Sanjay Deshmukh Review" },
    { id: 18, src: "/review-new-10.png", alt: "Mayur Patil Review" },
    { id: 19, src: "/review-new-11.png", alt: "Rahul Patil Review" },
    { id: 20, src: "/review-new-12.png", alt: "Nandkishor Vijay Patil Review" },
    { id: 21, src: "/review-new-13.png", alt: "Chinmay Lande Review" },
    { id: 22, src: "/review-new-14.png", alt: "Rushikesh Shrungare Review" },
    { id: 23, src: "/review-new-15.png", alt: "Yash Patil Review" },
    { id: 24, src: "/review-new-16.png", alt: "Rupesh Patil Review" },
    { id: 25, src: "/review-new-17.png", alt: "Mahi Patel Review" },
    { id: 26, src: "/review-new-18.png", alt: "Priyanka Bhamare Review" },
    { id: 27, src: "/review-new-19.png", alt: "Swapnil Dutte Review" },
    { id: 28, src: "/review-new-20.png", alt: "Nikhil Patil Review" },
    { id: 29, src: "/review-new-21.png", alt: "Dnyaneshwar Patil Review" },
    { id: 30, src: "/review-new-22.png", alt: "Prajyot Patil Review" },
    { id: 31, src: "/review-new-23.png", alt: "Akshay Mahajan Review" },
    { id: 32, src: "/review-new-24.png", alt: "Amit Deshmukh Review" }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: -15,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const fadeUpBlur = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Section - Matching About Us Style */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/Contactbg.jpeg"
          alt="Advik Enterprises Industrial Background"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] object-cover"
        />
        <div className="absolute inset-0 bg-advik-navy/60 flex items-center justify-center">
          <div className="text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl font-display text-white mb-6 uppercase tracking-tight"
            >
              Reviews
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
              <span className="text-advik-yellow">Reviews</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Content Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="advik-container">

          <div className="text-center max-w-3xl mx-auto mb-16 px-4">
            <motion.p
              variants={fadeUpBlur}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-advik-yellow font-black uppercase tracking-[0.3em] text-xs mb-3"
            >
              Authentic Feedback
            </motion.p>
            <motion.h2
              variants={fadeUpBlur}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display text-advik-navy mb-6 uppercase lg:whitespace-nowrap"
            >
              What Our Customers <span className="text-advik-yellow underline decoration-4 underline-offset-8">Say</span>
            </motion.h2>
          </div>

          {/* Screenshots Grid with Cascade Animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch perspective-1000"
          >
            {reviewScreenshots.map((review) => (
              <motion.div
                key={review.id}
                variants={itemVariants}
                className="bg-white p-4 shadow-xl border border-gray-100 rounded-none group hover:border-advik-yellow transition-colors duration-500 h-full flex flex-col"
              >
                <div className="aspect-[3/1] overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center">
                  <img
                    src={review.src}
                    alt={review.alt}
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default ReviewsPage;
