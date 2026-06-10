import { motion } from "motion/react";
import { ExternalLink, ShieldCheck } from "lucide-react";

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-8 md:p-16 shadow-xl border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-[#E6F3EC] rounded-2xl flex items-center justify-center text-primary mb-8">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-ng-text mb-8 tracking-tight">Protecting Nigeria's <br/><span className="text-primary italic">Democratic Future.</span></h1>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              The Nigeria E-Voter platform is the official digital infrastructure developed to modernize the electoral process. 
              We believe that technology is the key to ensuring fair, transparent, and accessible elections for every Nigerian citizen.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              Our system integrates high-security biometric identification with decentralized data management to ensure that 
              every vote is unique, verifiable, and counted correctly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
            <ResourceLink 
              href="http://cvr.inecnigeria.org"
              title="Continuous Registration"
              description="Official INEC portal for voter registration updates."
            />
            <ResourceLink 
              href="http://cvr.inecnigeria.org"
              title="Verification System"
              description="Check your current registration details online."
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ResourceLink({ href, title, description }: { href: string, title: string, description: string }) {
  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block p-6 rounded-2xl bg-gray-50 border border-transparent hover:bg-white hover:border-primary hover:shadow-xl transition-all group h-full"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-ng-text group-hover:text-primary transition-colors">{title}</h3>
          <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-primary" />
        </div>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">{description}</p>
      </a>
    </motion.div>
  );
}
