import { motion, AnimatePresence } from "motion/react";
import { UserPlus, Upload, Fingerprint, ShieldCheck, Vote, Smartphone, Mail, Lock, CheckCircle2, Building2, Camera, Scan, FileText, BadgeCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { STATES } from "../constants";
import { Voter, ApiResponse } from "../types";

enum RegisterStep {
  FORM = "form",
  ELIGIBILITY = "eligibility",
  VERIFICATION = "verification",
  PASSWORD = "password",
  SUCCESS = "success"
}

export function Register() {
  const [step, setStep] = useState<RegisterStep>(RegisterStep.FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nationalIdInputRef = useRef<HTMLInputElement>(null);
  const birthCertInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState({
    surname: "",
    firstName: "",
    lastName: "",
    stateOfOrigin: "",
    occupation: "",
    address: "",
    gender: "male" as "male" | "female",
    phoneNumber: "",
    email: "",
    nin: "",
    biometricId: "",
  });

  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [registeredVoter, setRegisteredVoter] = useState<Voter | null>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const [nationalIdPreview, setNationalIdPreview] = useState<string | null>(null);
  const [birthCertPreview, setBirthCertPreview] = useState<string | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [faceScanPreview, setFaceScanPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processFile = (file: File, callback: (result: string) => void) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'passport' | 'nationalId' | 'birthCert' | 'license') => {
    const file = e.target.files?.[0];
    if (!file) return;

    switch (type) {
      case 'passport': processFile(file, setPassportPreview); break;
      case 'nationalId': processFile(file, setNationalIdPreview); break;
      case 'birthCert': processFile(file, setBirthCertPreview); break;
      case 'license': processFile(file, setLicensePreview); break;
    }
  };

  const startFaceScan = async () => {
    setIsScanning(true);
    setFaceScanPreview(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setError("Camera access is required for Face Scan verification.");
      setIsScanning(false);
    }
  };

  const captureFace = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setFaceScanPreview(dataUrl);
      
      // Stop stream
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsScanning(false);
    }
  };

  const [verificationStage, setVerificationStage] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(RegisterStep.ELIGIBILITY);
  };

  const handleEligibilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nin || formData.nin.length !== 11) {
      setError("Please provide a valid 11-digit NIN.");
      return;
    }
    if (!faceScanPreview) {
      setError("Face scan is required for identity verification.");
      return;
    }
    
    setLoading(true);
    setError(null);

    const stages = [
      "Connecting to NIMC Database...",
      "Verifying National Identity Number...",
      "Analyzing Document Authenticity...",
      "Performing Biometric Match..."
    ];

    let currentStage = 0;
    const stageInterval = setInterval(() => {
      if (currentStage < stages.length) {
        setVerificationStage(stages[currentStage]);
        currentStage++;
      } else {
        clearInterval(stageInterval);
      }
    }, 400);

    try {
      const response = await fetch("/api/verify-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nin: formData.nin,
          faceScan: faceScanPreview,
          documents: {
            nationalId: !!nationalIdPreview,
            birthCert: !!birthCertPreview,
            license: !!licensePreview
          }
        })
      });

      const result: ApiResponse<any> = await response.json();

      if (result.success) {
        setTimeout(() => {
          setStep(RegisterStep.VERIFICATION);
          setVerificationStage(null);
          setLoading(false);
          clearInterval(stageInterval);
        }, 1200);
      } else {
        setError(result.error || "Eligibility verification failed.");
        setVerificationStage(null);
        setLoading(false);
        clearInterval(stageInterval);
      }
    } catch (err) {
      setError("Unable to connect to verification servers.");
      setVerificationStage(null);
      setLoading(false);
      clearInterval(stageInterval);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === "123456") { // Simulated code
      setStep(RegisterStep.PASSWORD);
    } else {
      setError("Invalid verification code. Use 123456 for demo.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate biometric capture
      const biometricId = `BIO-${Math.random().toString(36).substring(7).toUpperCase()}`;
      
      const voterPayload: Partial<Voter> = {
        ...formData,
        password,
        biometricId,
        passportUrl: passportPreview || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + formData.surname,
        nationalIdUrl: nationalIdPreview || undefined,
        birthCertificateUrl: birthCertPreview || undefined,
        driversLicenseUrl: licensePreview || undefined
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voterPayload)
      });

      const result: ApiResponse<Voter> = await response.json();

      if (result.success && result.data) {
        setRegisteredVoter(result.data);
        setStep(RegisterStep.SUCCESS);
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 flex flex-col gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-widest">Navigation</h3>
          <nav className="flex flex-col gap-2">
            <div className="bg-[#E6F3EC] text-primary p-3 rounded-lg flex items-center gap-3 font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Voter Registration
            </div>
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => alert("Verification Status portal is coming soon. Please check back during the election week.")}
              className="p-3 text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-3 text-sm cursor-pointer transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              Verification Status
            </motion.div>
          </nav>
        </div>

        <div className="bg-primary rounded-xl p-5 shadow-lg text-white">
          <p className="text-[10px] opacity-80 uppercase font-bold mb-2 tracking-widest">Election Notice</p>
          <p className="text-sm leading-tight font-medium">
            Individuals may only vote for Governorship/Chairman in their state of residence.
          </p>
          <div className="mt-4 pt-4 border-t border-white/20 font-mono text-center">
            *711*2020#<br/>
            <span className="text-[10px] opacity-70">Dial to check registration</span>
          </div>
        </div>
      </aside>

      {/* Main Form */}
      <section className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col min-h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          {step === RegisterStep.FORM && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary">Voter Registration Form</h2>
                  <p className="text-sm text-gray-500">Step 1: Bio-data and Contact Information</p>
                </div>
                <div className="w-12 h-12 bg-[#E6F3EC] rounded-xl flex items-center justify-center text-primary">
                  <UserPlus className="w-6 h-6" />
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InputField label="Surname" name="surname" value={formData.surname} onChange={handleInputChange} placeholder="Adebayo" required />
                    <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Chidi" required />
                    <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Musa" required />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">State of Origin</label>
                      <select 
                        name="stateOfOrigin"
                        value={formData.stateOfOrigin}
                        onChange={handleInputChange}
                        required
                        className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="">Select State</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Gender</label>
                      <div className="flex gap-4 mt-2">
                        <RadioField label="Male" name="gender" value="male" checked={formData.gender === "male"} onChange={handleInputChange} />
                        <RadioField label="Female" name="gender" value="female" checked={formData.gender === "female"} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Occupation" name="occupation" value={formData.occupation} onChange={handleInputChange} placeholder="Civil Servant" required />
                    <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="080XXXXXXXX" required />
                  </div>
                  
                  <InputField label="Personal Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="name@example.com" required />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Residential Address</label>
                    <textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm h-20 resize-none focus:outline-none focus:border-primary transition-colors" 
                      placeholder="No. 42 Crescent, Victoria Island, Lagos"
                    ></textarea>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-primary hover:bg-white transition-all overflow-hidden"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={(e) => handleFileChange(e, 'passport')} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    {passportPreview ? (
                      <img src={passportPreview} alt="Passport Preview" className="w-32 h-32 object-cover rounded-xl shadow-md" />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#E6F3EC] group-hover:text-primary transition-colors">
                        <Upload className="w-8 h-8" />
                      </div>
                    )}
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                        {passportPreview ? "Change Passport Photo" : "Upload Passport Photo"}
                      </span>
                      <span className="text-[9px] text-gray-400">JPG or PNG, max 1MB</span>
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
                       <Smartphone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                       <p className="text-xs text-primary/80 font-medium">
                         Your bio-data will be used to verify your identity across national databases.
                       </p>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
                    >
                      {loading ? "PROCESSING..." : "CONTINUE TO ELIGIBILITY"}
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {step === RegisterStep.ELIGIBILITY && (
            <motion.div
              key="eligibility"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary">Eligibility Verification</h2>
                  <p className="text-sm text-gray-500">Step 2: National ID and Bio-Eligibility</p>
                </div>
                <div className="w-12 h-12 bg-[#E6F3EC] rounded-xl flex items-center justify-center text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <form onSubmit={handleEligibilitySubmit} className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <InputField 
                    label="National Identification Number (NIN)" 
                    name="nin" 
                    value={formData.nin} 
                    onChange={handleInputChange} 
                    placeholder="12345678901" 
                    required 
                  />

                  <div className="grid grid-cols-1 gap-4">
                    <FileUploadButton 
                      label="National ID Card" 
                      preview={nationalIdPreview} 
                      onClick={() => nationalIdInputRef.current?.click()}
                      icon={<ShieldCheck className="w-5 h-5" />}
                    />
                    <input type="file" ref={nationalIdInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'nationalId')} accept="image/*,.pdf" />

                    <FileUploadButton 
                      label="Birth Certificate" 
                      preview={birthCertPreview} 
                      onClick={() => birthCertInputRef.current?.click()}
                      icon={<FileText className="w-5 h-5" />}
                    />
                    <input type="file" ref={birthCertInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'birthCert')} accept="image/*,.pdf" />

                    <FileUploadButton 
                      label="Driver's License (Optional)" 
                      preview={licensePreview} 
                      onClick={() => licenseInputRef.current?.click()}
                      icon={<BadgeCheck className="w-5 h-5" />}
                    />
                    <input type="file" ref={licenseInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'license')} accept="image/*,.pdf" />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="p-6 border-2 border-gray-100 rounded-2xl bg-gray-50 relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]">
                    {faceScanPreview ? (
                      <div className="text-center space-y-4">
                        <div className="relative">
                          <img src={faceScanPreview} alt="Face Scan" className="w-48 h-48 object-cover rounded-full border-4 border-primary shadow-xl" />
                          <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        </div>
                        <button type="button" onClick={startFaceScan} className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Retake Scan</button>
                      </div>
                    ) : isScanning ? (
                      <div className="relative w-full h-full flex flex-col items-center">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-xl bg-black" />
                        <canvas ref={canvasRef} className="hidden" />
                        <div className="absolute inset-0 border-2 border-primary/50 rounded-xl pointer-events-none overflow-hidden">
                           <motion.div 
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_15px_rgba(30,121,79,1)]"
                           />
                        </div>
                        <button 
                          type="button" 
                          onClick={captureFace}
                          className="mt-4 px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                        >
                          <Camera className="w-4 h-4" /> CAPTURE IDENTITY
                        </button>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-[#E6F3EC] rounded-full flex items-center justify-center mx-auto text-primary">
                          <Scan className="w-10 h-10" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-ng-text">Live Identity Scan</p>
                          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">Required for age and identity verification</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={startFaceScan}
                          className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg flex items-center gap-2 mx-auto"
                        >
                          <Camera className="w-4 h-4" /> START SCAN
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto space-y-4">
                    {error && <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex flex-col items-center">
                          <span className="animate-pulse">{verificationStage || "VERIFYING..."}</span>
                        </div>
                      ) : (
                        <>VERIFY & PROCEED</>
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {step === RegisterStep.VERIFICATION && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-12 flex flex-col items-center justify-center h-full text-center space-y-8"
            >
              <div className="w-20 h-20 bg-[#E6F3EC] rounded-full flex items-center justify-center text-primary">
                <Mail className="w-10 h-10" />
              </div>
              <div className="max-w-sm">
                <h2 className="text-2xl font-bold text-ng-text">Check your Email</h2>
                <p className="text-gray-500 mt-2">
                  We've sent a 6-digit verification code to <span className="font-bold text-primary">{formData.email}</span>
                </p>
              </div>
              
              <form onSubmit={handleVerifyCode} className="w-full max-w-xs space-y-4">
                <InputField 
                  label="Verification Code" 
                  value={verificationCode} 
                  onChange={(e: any) => setVerificationCode(e.target.value)} 
                  placeholder="XXXXXX" 
                  className="text-center text-2xl tracking-[0.5em] font-black"
                />
                {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
                <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg">
                  VERIFY CODE
                </motion.button>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">
                  Didn't receive code? Resend
                </div>
              </form>
            </motion.div>
          )}

          {step === RegisterStep.PASSWORD && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-12 flex flex-col items-center justify-center h-full space-y-8"
            >
               <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white">
                <Lock className="w-10 h-10" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-ng-text">Create Secure Password</h2>
                <p className="text-gray-500 text-sm">Set a strong password to protect your voter card and login.</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm space-y-8">
                <div className="space-y-4">
                   <InputField 
                    label="Strong Password" 
                    type="password"
                    value={password} 
                    onChange={(e: any) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                  />
                  <div className="p-6 border border-green-100 rounded-xl bg-[#F0F7F0] flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-primary/20">
                      <Fingerprint className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest text-center italic">
                      Biometric link required for account finalization
                    </p>
                  </div>
                </div>
                
                {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
                
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg transition-transform disabled:opacity-50"
                >
                  {loading ? "FINALIZING..." : "CREATE ACCOUNT & REGISTER"}
                </motion.button>
              </form>
            </motion.div>
          )}

          {step === RegisterStep.SUCCESS && registeredVoter && (
             <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center justify-center h-full text-center space-y-8"
            >
               <div className="relative">
                 <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-12 h-12" />
                 </div>
                 <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full border-4 border-white flex items-center justify-center text-white text-[10px] font-bold"
                 >
                   NG
                 </motion.div>
               </div>
               
               <div>
                 <h2 className="text-3xl font-black text-ng-text">REGISTRATION COMPLETE!</h2>
                 <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                   Your Digital Permanent Voter Card (PVC) has been successfully generated.
                 </p>
               </div>

               <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-6 border border-gray-100 flex gap-4 items-center text-left">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 border border-gray-200 flex-shrink-0">
                    <img src={registeredVoter.passportUrl} alt="Passport" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Voter ID</p>
                    <p className="text-lg font-black text-primary tracking-tighter">{registeredVoter.id}</p>
                    <p className="text-[10px] font-bold text-ng-text opacity-70 uppercase">{registeredVoter.surname}, {registeredVoter.firstName}</p>
                  </div>
                  <div className="ml-auto bg-green-600/10 p-2 rounded-lg">
                    <Building2 className="w-5 h-5 text-green-600" />
                  </div>
               </div>

               <div className="flex gap-4 w-full max-w-sm">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => window.print()} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-50 uppercase tracking-widest">
                    PRINT CARD
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => window.location.href = '/vote'} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-md uppercase tracking-widest">
                    PROCEED TO VOTE
                  </motion.button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Right Aside */}
      <aside className="w-full lg:w-72 flex flex-col gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex-1">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-widest">Support & Verification</h3>
          <div className="space-y-5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Official Links</span>
              <a href="http://cvr.inecnigeria.org" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                cvr.inecnigeria.org
              </a>
              <a href="http://cvr.inecnigeria.org" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                vvs.inecnigeria.org
              </a>
            </div>
            <div className="flex flex-col pt-4 border-t border-gray-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Help Desk</span>
              <span className="text-sm font-bold text-ng-text">09084444333</span>
            </div>
            <div className="flex flex-col pt-4 border-t border-gray-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verification Line</span>
              <span className="text-sm font-bold text-ng-text">08171646879</span>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-[10px] font-bold text-yellow-800 uppercase tracking-widest">Security Tip</p>
              <p className="text-[11px] text-yellow-700 leading-tight mt-1 font-medium italic">
                A verification code will be sent to your registered email to finalize your account security.
              </p>
            </div>
          </div>
        </div>

        <div className="h-40 relative rounded-xl overflow-hidden bg-primary shadow-lg shadow-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-90"></div>
          <div className="relative p-6 flex flex-col h-full justify-center items-center text-center text-white">
            <Vote className="w-8 h-8 mb-2 opacity-50" />
            <div className="text-2xl font-black italic tracking-tighter">EVERY VOTE COUNTS</div>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] mt-1 opacity-70">Federal Republic Project</div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder, type = "text", required, className = "" }: any) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">{label}</label>
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors ${className}`}
      />
    </div>
  );
}

function FileUploadButton({ label, preview, onClick, icon }: any) {
  return (
    <button 
      onClick={onClick}
      type="button"
      className={`p-4 border-2 border-dashed rounded-xl transition-all flex items-center justify-between group ${preview ? 'border-primary bg-[#E6F3EC]' : 'border-gray-200 bg-gray-50 hover:border-primary hover:bg-white'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${preview ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#E6F3EC] group-hover:text-primary'}`}>
          {icon}
        </div>
        <div className="text-left">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
          <p className="text-xs font-bold text-ng-text">{preview ? 'Document Selected' : 'Tap to Upload'}</p>
        </div>
      </div>
      {preview && <CheckCircle2 className="w-5 h-5 text-primary" />}
    </button>
  );
}

function RadioField({ label, name, value, checked, onChange }: any) {
  return (
    <label className="text-xs font-semibold flex items-center gap-2 cursor-pointer group">
      <input 
        type="radio" 
        name={name} 
        value={value} 
        checked={checked} 
        onChange={onChange}
        className="text-primary focus:ring-primary w-4 h-4" 
      /> 
      <span className="group-hover:text-primary transition-colors">{label}</span>
    </label>
  );
}
