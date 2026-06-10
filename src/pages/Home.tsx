import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Vote, UserPlus, Info, HelpCircle, ShieldCheck, ChevronRight } from "lucide-react";
import React from "react";

export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F3EC] text-primary text-[10px] font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Biometrics Enabled
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-ng-text tracking-tighter leading-[0.9]">
            The Future of <span className="text-primary italic">Democratic</span> Participation.
          </h1>
          <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
            Securely register and cast your vote from anywhere in the world. 
            Your voice, protected by world-class biometric identification.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="inline-block px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1">
                Register Now
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link to="/about" className="inline-block px-8 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
                Learn More <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:w-1/2 relative"
        >
          <div className="relative z-10 bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100">
             <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 relative group cursor-pointer">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-center space-y-4">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl border border-gray-100">
                      <ShieldCheck className="w-10 h-10 text-primary" />
                   </div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Identify Yourself</p>
                </div>
             </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/5 rounded-full blur-3xl"></div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        <HomeCard 
          to="/register"
          icon={<UserPlus className="w-6 h-6" />}
          title="Voter Card"
          description="Register for your permanent voters card online with biometrics."
        />
        <HomeCard 
          to="/vote"
          icon={<Vote className="w-6 h-6" />}
          title="Digital Ballot"
          description="Cast your vote in presidential and local elections securely."
        />
        <HomeCard 
          to="/about"
          icon={<Info className="w-6 h-6" />}
          title="INEC Portal"
          description="Synchronize your data with official electoral records."
        />
        <HomeCard 
          to="/help"
          icon={<HelpCircle className="w-6 h-6" />}
          title="Help Center"
          description="Guidelines and contacts for electoral assistance."
        />
      </div>

      <div className="bg-primary rounded-[40px] p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-4">Every Citizen, Every Vote.</h2>
              <p className="text-white/70 text-lg">
                Join millions of Nigerians in building a transparent electoral future. 
                Our platform ensures integrity through decentralized ledger technology.
              </p>
           </div>
           <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-black font-mono tracking-tighter">*711*2020#</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 text-center">Dial to verify your status</div>
           </div>
        </div>
        <div className="mt-24 bg-primary rounded-[48px] p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-dark rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
               <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
               Experience Feedback
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
              Are you satisfied with our services?
            </h2>
            <p className="text-white/80 font-medium text-lg leading-relaxed">
              Your feedback helps us build a more transparent and accessible electoral system for every Nigerian.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link to="/review" className="px-10 py-5 bg-white text-primary font-black rounded-2xl shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1 uppercase tracking-widest text-sm inline-block">
                  Write a Review
                </Link>
              </motion.div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link to="/help" className="px-10 py-5 bg-primary-dark border border-white/20 text-white font-black rounded-2xl hover:bg-black/20 transition-all uppercase tracking-widest text-sm inline-block">
                  Get Support
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeCard({ to, icon, title, description }: { to: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div whileTap={{ scale: 0.98 }} className="h-full">
      <Link to={to} className="group h-full bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary transition-all block">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 text-gray-400 group-hover:bg-[#E6F3EC] group-hover:text-primary transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-ng-text mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        <div className="mt-8 flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
          Get Started <ChevronRight className="w-3 h-3" />
        </div>
      </Link>
    </motion.div>
  );
}
