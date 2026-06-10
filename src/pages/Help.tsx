import { motion } from "motion/react";
import { Phone, Fingerprint, Search, PlayCircle } from "lucide-react";

export function Help() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-8 md:p-16 shadow-xl border border-gray-100"
      >
        <h1 className="text-4xl font-black text-primary mb-12 tracking-tight">Support & Guidelines</h1>
        
        <div className="space-y-16">
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-primary" /> Visual Tutorial
                </h2>
                <h3 className="text-2xl font-black text-ng-text tracking-tight">Official Registration Guide</h3>
              </div>
              <p className="text-xs text-gray-400 font-bold max-w-xs">
                Watch this official INEC guide to understand the complete registration and voting process.
              </p>
            </div>

            <div className="w-full">
              <div className="aspect-video w-full bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl relative group cursor-pointer border-8 border-white">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/6nU-_a0F6S8?autoplay=0" 
                  title="INEC Voter Registration Guide"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-sm font-bold text-ng-text text-center mt-6 uppercase tracking-widest opacity-50">Authorized Electoral Tutorial</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-primary/5 p-8 rounded-[32px] border border-primary/10">
               <div>
                 <h3 className="text-lg font-bold text-primary mb-4">How to Register</h3>
                 <ul className="space-y-3 text-sm text-gray-600 list-decimal pl-4 font-medium">
                   <li>Navigate to the <span className="text-primary font-bold">Registration</span> page.</li>
                   <li>Fill in your correct Bio-data (Surname, First Name, etc).</li>
                   <li>Upload a clear Passport Photo for identification.</li>
                   <li>Verify your email with the 6-digit code sent to you.</li>
                   <li>Create a secure password and link your biometrics.</li>
                   <li>Download and print your Digital PVC.</li>
                 </ul>
               </div>
               <div>
                 <h3 className="text-lg font-bold text-primary mb-4">How to Login & Vote</h3>
                 <ul className="space-y-3 text-sm text-gray-600 list-decimal pl-4 font-medium">
                   <li>Go to the <span className="text-primary font-bold">Voting</span> portal.</li>
                   <li>Login using your registered <span className="text-ng-text font-bold">Email</span> and <span className="text-ng-text font-bold">Password</span>.</li>
                   <li>Select your preferred <span className="text-ng-text font-bold">Election Category</span>.</li>
                   <li>Complete the <span className="text-ng-text font-bold">Biometric Authentication</span> step.</li>
                   <li>Pick your candidate from the digital ballot.</li>
                   <li>Submit your vote to record it on the blockchain.</li>
                 </ul>
               </div>
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" /> Self Service Verification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="bg-gray-50 p-10 rounded-3xl border-2 border-dashed border-gray-200 group hover:border-primary transition-colors text-center cursor-alias"
              >
                <p className="text-4xl md:text-5xl font-black text-primary tracking-tighter group-hover:scale-105 transition-transform">
                  *711*2020#
                </p>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-6">
                  USSD Verification
                </p>
              </motion.div>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open("http://cvr.inecnigeria.org", "_blank")}
                className="bg-[#E6F3EC] p-10 rounded-3xl border-2 border-transparent hover:border-primary transition-all text-center cursor-pointer flex flex-col items-center justify-center"
              >
                <p className="text-xl font-black text-primary tracking-tight">
                  cvr.inecnigeria.org
                </p>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-4">
                  Online Portal
                </p>
              </motion.div>
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> Official Support Lines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ContactCard 
                label="General Inquiries"
                number="09084444333"
                description="Technical support and general portal usage help."
              />
              <ContactCard 
                label="Security & Verification"
                number="08171646879"
                description="Assistance with biometric and identity validation."
              />
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-primary" /> Important Regulations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GuidelineItem 
                title="Residency Restriction"
                text="Governorship and Chairman votes are limited to your registered state of origin or residence."
              />
              <GuidelineItem 
                title="Secondary Access"
                text="Non-smartphone users can authorize a secondary device for presidential polling sessions."
              />
              <GuidelineItem 
                title="Biometric Mandatory"
                text="Zero tolerance policy for manual overrides. All electoral participation requires digital ID."
              />
              <GuidelineItem 
                title="Double Voting"
                text="Our system uses AI-driven deduplication to prevent and report multiple ballot attempts."
              />
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

function ContactCard({ label, number, description }: { label: string, number: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-[#E6F3EC] border border-primary/5 flex flex-col items-center text-center">
      <span className="text-[10px] uppercase font-bold tracking-widest text-primary mb-3">{label}</span>
      <p className="text-2xl font-black text-ng-text mb-2">{number}</p>
      <p className="text-xs text-gray-500 font-medium">{description}</p>
    </div>
  );
}

function GuidelineItem({ title, text }: { title: string, text: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
      <div>
        <h4 className="font-bold text-ng-text text-sm mb-1">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed font-medium">{text}</p>
      </div>
    </div>
  );
}
