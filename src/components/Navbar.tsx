import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { Vote, UserPlus, Info, HelpCircle, MessageSquare, ShieldCheck } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { to: "/register", icon: UserPlus, label: "Registration" },
    { to: "/vote", icon: Vote, label: "Voting" },
    { to: "/review", icon: MessageSquare, label: "Reviews" },
    { to: "/about", icon: Info, label: "About" },
    { to: "/help", icon: HelpCircle, label: "Support" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between h-20 items-center">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-primary rounded-2xl rotate-3 flex items-center justify-center shadow-xl shadow-primary/20 group-hover:rotate-0 transition-transform duration-300 overflow-hidden">
                  <ShieldCheck className="w-8 h-8 text-white" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                   <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter text-primary leading-none uppercase">
                  NGA <span className="text-slate-900">E-VOTER</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">
                  National Electoral Portal
                </p>
              </div>
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <motion.div key={item.to} whileTap={{ scale: 0.95 }}>
                <Link
                  to={item.to}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                    location.pathname === item.to
                      ? "bg-[#E6F3EC] text-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-3">
               <div className="text-right hidden lg:block">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">System Status</p>
                  <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                    Biometrics Active
                  </p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                 NG
               </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
