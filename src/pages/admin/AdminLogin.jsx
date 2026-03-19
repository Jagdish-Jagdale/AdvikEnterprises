import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back! login successful.");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      let errorMessage = "Authentication failed. Please try again.";

      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-email"
      ) {
        errorMessage =
          "The email address provided is not registered in our system.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage =
          "The password you entered is incorrect. Please try again.";
      } else if (err.code === "auth/invalid-credential") {
        errorMessage =
          "Invalid credentials. Please verify your email and password.";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Image with Professional Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/MainPackaging.png')" }}
      >
        <div className="absolute inset-0 bg-[#0A0F1A]/85 backdrop-blur-[2px]" />
      </div>

      {/* Decorative Light Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-advik-yellow/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-white/[0.03] rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] z-10"
      >
        {/* Ultra-Glass Login Card */}
        <div className="bg-white/10 backdrop-blur-[32px] rounded-2xl border border-white/20 p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden ring-1 ring-white/10">
          {/* Internal Glass Highlight */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center">
              {/* Logo inside card */}
              <div className="flex justify-center mb-8">
                <div className="inline-block">
                  <img
                    src="/AdvikFooter.png"
                    alt="Logo"
                    className="h-20 w-auto"
                  />
                </div>
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
                Systems Access
              </h2>
              <p className="text-white/40 text-sm mb-12 font-medium">
                Administrative portal for Advik Enterprises
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3 text-left">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-advik-yellow/80 ml-1">
                  Email{" "}
                </label>
                <div className="relative group/input">
                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-advik-yellow transition-colors"
                    size={20}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    className="w-full h-14 bg-black/20 border border-white/10 rounded-xl pl-14 pr-4 text-white font-medium focus:outline-none focus:border-advik-yellow/40 focus:bg-black/40 transition-all duration-300 placeholder:text-white/40"
                    placeholder="Enter email address"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-3 text-left">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-advik-yellow/80 ml-1">
                  Password
                </label>
                <div className="relative group/input">
                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-advik-yellow transition-colors"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-black/20 border border-white/10 rounded-xl pl-14 pr-12 text-white font-medium focus:outline-none focus:border-advik-yellow/40 focus:bg-black/40 transition-all duration-300 placeholder:text-white/40"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{
                  y: -2,
                  shadow: "0 20px 40px -10px rgba(234,179,8,0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full h-14 bg-advik-yellow text-advik-navy font-black rounded-xl flex items-center justify-center gap-4 transition-all duration-500 shadow-xl shadow-advik-yellow/20 text-sm tracking-widest uppercase ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "LOGIN ..." : "Login"}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Action Link */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 text-xs font-bold text-white/40 hover:text-white transition-all duration-300 uppercase tracking-[0.3em]"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-advik-yellow/50 transition-colors">
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </div>
            Return to Website
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
