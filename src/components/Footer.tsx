import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-100 py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-[8px] font-bold">
              NG
            </div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              &copy; {new Date().getFullYear()} Independent National Electoral Commission (INEC) Nigeria
            </div>
          </div>

          <div className="flex gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <motion.div whileTap={{ scale: 0.95 }}><Link to="/review" className="hover:text-primary transition-colors">Reviews</Link></motion.div>
            <motion.div whileTap={{ scale: 0.95 }}><Link to="/about" className="hover:text-primary transition-colors">Privacy</Link></motion.div>
            <motion.div whileTap={{ scale: 0.95 }}><Link to="/help" className="hover:text-primary transition-colors">Terms</Link></motion.div>
            <motion.div whileTap={{ scale: 0.95 }}><Link to="/help" className="hover:text-primary transition-colors">Guidelines</Link></motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
