import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Layers,
  Package,
  MessageSquare
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';

const StatCard = ({ label, value, icon: Icon, bgIcon, textColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-5 flex-1 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className={`w-14 h-14 rounded-full ${bgIcon} flex items-center justify-center flex-shrink-0`}>
      <Icon size={24} className={textColor} />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-3xl font-black text-gray-800 tracking-tighter">{value}</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [counts, setCounts] = useState({
    visitors: 0,
    categories: 0,
    products: 0,
    messages: 0
  });

  useEffect(() => {
    // Categories count
    const unsubscribeCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCounts(prev => ({ ...prev, categories: snapshot.size }));
    });

    // Products count
    const unsubscribeProds = onSnapshot(collection(db, 'products'), (snapshot) => {
      setCounts(prev => ({ ...prev, products: snapshot.size }));
    });

    // Messages count
    const unsubscribeMsgs = onSnapshot(collection(db, 'messages'), (snapshot) => {
      setCounts(prev => ({ ...prev, messages: snapshot.size }));
    });

    // Visitors count
    const unsubscribeVisitors = onSnapshot(doc(db, 'site_stats', 'visitors'), (docSnap) => {
      if (docSnap.exists()) {
        setCounts(prev => ({ ...prev, visitors: docSnap.data().count }));
      }
    });

    return () => {
      unsubscribeCats();
      unsubscribeProds();
      unsubscribeMsgs();
      unsubscribeVisitors();
    };
  }, []);

  const stats = [
    { label: 'Visitors Count', value: counts.visitors.toLocaleString(), icon: Users, bgIcon: 'bg-blue-50', textColor: 'text-blue-500', delay: 0.1 },
    { label: 'Total Categories', value: counts.categories, icon: Layers, bgIcon: 'bg-indigo-50', textColor: 'text-indigo-500', delay: 0.2 },
    { label: 'Total Products', value: counts.products, icon: Package, bgIcon: 'bg-amber-50', textColor: 'text-amber-500', delay: 0.3 },
    { label: 'Total Messages', value: counts.messages, icon: MessageSquare, bgIcon: 'bg-emerald-50', textColor: 'text-emerald-500', delay: 0.4 },
  ];

  return (
    <>
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-inter font-bold text-gray-900 tracking-tight mb-2 normal-case">Welcome Admin...!</h1>
        <p className="font-inter text-gray-500 text-base font-normal max-w-2xl leading-relaxed">
          Monitor project performance, client engagement, and manage resources from a single control center.
        </p>
        <hr className="mt-8 border-gray-200" />
      </div>

      {/* Redesigned Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>
    </>
  );
};

export default Dashboard;
