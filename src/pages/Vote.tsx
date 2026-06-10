import { motion, AnimatePresence } from "motion/react";
import { Vote as VoteIcon, ChevronRight, Fingerprint, Smartphone, AlertCircle, CheckCircle2, Lock, User, Briefcase, MapPin, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import React from "react";
import { NIGERIAN_PARTIES, STATES } from "../constants";
import { Voter, ApiResponse, Vote as VoteType } from "../types";

type ElectionType = "presidential" | "gubernatorial" | "chairman";

export function Vote() {
  const [voter, setVoter] = useState<Voter | null>(null);
  const [electionType, setElectionType] = useState<ElectionType | null>(null);
  const [votingState, setVotingState] = useState<string>("");
  const [step, setStep] = useState(0); // 0: Login, 1: Category, 2: Bio, 3: Loading, 4: Ballot, 5: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("voter");
    if (saved) {
      setVoter(JSON.parse(saved));
      setStep(1);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const result: ApiResponse<Voter> = await response.json();
      if (result.success && result.data) {
        setVoter(result.data);
        localStorage.setItem("voter", JSON.stringify(result.data));
        setStep(1);
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleElectionSelect = (type: ElectionType) => {
    if (!voter) return;
    
    setElectionType(type);
    
    if (type === "presidential") {
      setStep(2);
    } else {
      // For Gov/Chairman, we need to know the state
      // In this specialized app, we'll ask for the state or use voter's state
      setVotingState(voter.stateOfOrigin);
      setStep(2);
    }
  };

  const handleVerify = () => {
    setStep(3);
    setTimeout(() => {
      setStep(4);
    }, 2000);
  };

  const handleVoteSubmit = async () => {
    if (!voter || !electionType || !selectedPartyId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voterId: voter.id,
          electionType,
          partyId: selectedPartyId,
          state: votingState || "Federal"
        })
      });

      const result: ApiResponse<VoteType> = await response.json();
      if (result.success) {
        setStep(5);
      } else {
        setError(result.error || "Voting failed");
        setStep(4);
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setElectionType(null);
    setStep(1);
    setSelectedPartyId(null);
    setError(null);
  };

  const logout = () => {
    localStorage.removeItem("voter");
    setVoter(null);
    setStep(0);
    reset();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-[70vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-4xl mx-auto"
          >
            <div className="md:w-1/2 bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
               <div className="relative z-10">
                 <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                    <VoteIcon className="w-8 h-8 text-white" />
                 </div>
                 <h1 className="text-4xl font-black italic tracking-tighter leading-tight">THE POWER <br/>OF YOUR VOTE.</h1>
                 <p className="mt-4 text-white/70 font-medium max-w-xs">
                   Login with your registered secure credentials to access the digital ballot.
                 </p>
               </div>
               <div className="relative z-10 text-[10px] uppercase font-bold tracking-[0.3em] opacity-50 mt-12">
                 Independent National Electoral Commission
               </div>
            </div>
            
            <div className="md:w-1/2 p-12 space-y-8">
               <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-ng-text">Security Portal</h2>
                  <p className="text-sm text-gray-500">Enter your credentials to continue.</p>
               </div>
               
               <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Registered Email</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          required
                          className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Fast-Response Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded-lg text-center">{error}</p>}
                  
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95 disabled:opacity-50"
                  >
                    {loading ? "AUTHENTICATING..." : "LOGIN TO BALLOT"}
                  </motion.button>
               </form>
               
               <div className="text-center">
                  <p className="text-xs text-gray-400">
                    Not registered? <a href="/register" className="text-primary font-bold hover:underline">Create a PVC account</a>
                  </p>
               </div>
            </div>
          </motion.div>
        )}

        {step === 1 && voter && (
          <motion.div
            key="category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
                    <img src={voter.passportUrl} alt="Voter" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Welcome, E-Voter</p>
                    <h2 className="text-xl font-bold text-ng-text">{voter.surname}, {voter.firstName}</h2>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-[#E6F3EC] px-2 py-0.5 rounded-full">
                          <MapPin className="w-2.5 h-2.5" /> {voter.stateOfOrigin}
                       </span>
                       <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          <Briefcase className="w-2.5 h-2.5" /> {voter.occupation}
                       </span>
                    </div>
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={logout} className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest border-2 border-gray-100 px-4 py-2 rounded-xl transition-colors">
                  Logout Session
                </motion.button>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black text-primary tracking-tighter">Active Elections</h1>
              <p className="text-gray-500 font-medium">Please select the election you are eligible for today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ElectionCard 
                title="Presidential"
                icon={<Smartphone className="w-8 h-8" />}
                description="Federal level election. Secondary login available for non-smartphone users."
                onClick={() => handleElectionSelect("presidential")}
              />
              <ElectionCard 
                title="Gubernatorial"
                icon={<VoteIcon className="w-8 h-8" />}
                description={`State election for ${voter.stateOfOrigin}. Restricted to your registered state.`}
                onClick={() => handleElectionSelect("gubernatorial")}
              />
              <ElectionCard 
                title="LGA Chairman"
                icon={<Building2 className="w-8 h-8" />}
                description="Local government election. Restricted to your registered LGA in your state."
                onClick={() => handleElectionSelect("chairman")}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-[24px] flex items-center gap-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-sm text-yellow-700 font-medium">
                <strong>Residency Notice:</strong> For Gubernatorial and Chairman elections, you are only permitted to vote for candidates in <span className="font-bold underline">{voter.stateOfOrigin}</span>. System biometrics will verify your location.
              </p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="bio"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[40px] p-16 shadow-2xl border border-gray-100 text-center space-y-8 max-w-2xl mx-auto"
          >
            <div className="relative w-32 h-32 mx-auto">
               <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 m-auto w-24 h-24 bg-[#F0F7F0] rounded-full flex items-center justify-center">
                  <Fingerprint className="w-12 h-12 text-primary" />
               </div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-ng-text mb-3 tracking-tight">Identity Authentication</h2>
              <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                Confirm your identity via fingerprint or facial recognition to unlock your digital ballot for the <span className="font-bold text-primary capitalize">{electionType}</span> election.
              </p>
            </div>
            <div className="flex flex-col gap-4">
               <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleVerify}
                className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 tracking-widest uppercase text-sm"
              >
                START BIOMETRIC SCAN
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={reset} className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-600">Return to Categories</motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-12 py-20"
          >
            <div className="relative w-40 h-40 mx-auto">
               <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping"></div>
               <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Fingerprint className="w-16 h-16 text-primary pulse scale-150 transition-transform duration-1000" />
               </div>
            </div>
            <div className="space-y-2">
               <p className="text-2xl font-black text-primary tracking-widest uppercase">Verifying Biometrics</p>
               <p className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.5em]">System.Validation.SecureID</p>
            </div>
          </motion.div>
        )}

        {step === 4 && voter && electionType && (
          <motion.div
            key="ballot"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-primary p-8 rounded-[32px] text-white shadow-xl shadow-primary/20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                   <VoteIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em]">Official Digital Ballot</p>
                   <h2 className="text-3xl font-black tracking-tighter uppercase">{electionType} ELECTION</h2>
                   <p className="text-xs font-medium text-white/70">
                      Voting Jurisdiction: <span className="text-white font-black">{electionType === 'presidential' ? 'Federal Republic' : votingState}</span>
                   </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Secure session</span>
              </div>
            </div>

            <div className="text-center py-4">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.5em]">Pick a candidate</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {NIGERIAN_PARTIES.map((party) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={party.id}
                  onClick={() => setSelectedPartyId(party.id)}
                  className={`relative p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-4 group ${
                    selectedPartyId === party.id 
                    ? "border-primary bg-white shadow-2xl scale-105 z-10" 
                    : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl shadow-lg transition-transform group-hover:scale-110 ${
                    selectedPartyId === party.id 
                    ? "text-white" 
                    : "bg-gray-50 text-gray-400"
                  }`} style={{ backgroundColor: selectedPartyId === party.id ? party.logoColor : undefined }}>
                    {party.shortName}
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-[9px] font-black uppercase text-gray-400 block tracking-widest">{party.shortName}</span>
                    <span className={`text-[11px] font-bold leading-tight ${selectedPartyId === party.id ? "text-primary" : "text-gray-600"}`}>
                      {party.name}
                    </span>
                  </div>
                  {selectedPartyId === party.id && (
                    <div className="absolute top-2 right-2">
                       <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-6 mt-12 bg-white p-8 rounded-[32px] border border-gray-100">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest max-w-xs text-center">
                 By submitting, you confirm this vote represents your single choice for this election category.
               </p>
               <motion.button 
                whileTap={selectedPartyId ? { scale: 0.98 } : {}}
                disabled={!selectedPartyId || loading}
                onClick={handleVoteSubmit}
                className={`w-full max-w-md py-5 rounded-[20px] font-black transition-all tracking-[0.2em] uppercase text-sm shadow-xl ${
                  selectedPartyId 
                  ? "bg-primary text-white shadow-primary/20 hover:bg-primary-dark" 
                  : "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                }`}
              >
                {loading ? "SUBMITTING BALLOT..." : "CAST CONFIDENTIAL VOTE"}
              </motion.button>
              {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] p-20 shadow-2xl border border-green-50 text-center space-y-8 max-w-2xl mx-auto overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
            <div className="relative z-10 w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-ng-text tracking-tighter">BALLOT RECORDED</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                Your choice has been securely encrypted and submitted. 
                Transparency and integrity have been maintained via decentralized verification.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-2">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Official Transaction UUID</p>
               <p className="font-mono text-sm font-bold text-primary break-all">
                  NG-VOTE-2024-{Math.random().toString(36).substring(2).toUpperCase()}-{Math.random().toString(36).substring(2).toUpperCase()}
               </p>
            </div>
            <div className="flex gap-4">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="flex-1 py-4 border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all uppercase tracking-widest text-xs"
              >
                Back to Elections
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex-1 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
              >
                End Session
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ElectionCard({ title, icon, description, onClick }: { title: string, icon: React.ReactNode, description: string, onClick: () => void }) {
  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary transition-all text-left flex flex-col group h-full"
    >
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 text-gray-400 group-hover:bg-[#E6F3EC] group-hover:text-primary transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-ng-text mb-2">{title} Election</h3>
      <p className="text-sm text-gray-500 leading-relaxed flex-grow">{description}</p>
      <div className="mt-8 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
        Vote Now <ChevronRight className="w-4 h-4" />
      </div>
    </motion.button>
  );
}
