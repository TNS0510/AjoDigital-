import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'motion/react';
import { ShieldCheck, Info } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tighter mb-2 serif">Welcome to AjoDigital</h1>
          <p className="text-gray-500">Secure your financial future with community trust.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-4 rounded-full hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          {loading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <div className="mt-10 space-y-4">
          <div className="flex gap-3 items-start text-sm text-gray-500">
            <ShieldCheck className="text-[#0066FF] shrink-0" size={20} />
            <p>We use Google for identity verification to ensure a safe community for everyone.</p>
          </div>
          <div className="flex gap-3 items-start text-sm text-gray-500">
            <Info className="text-[#0066FF] shrink-0" size={20} />
            <p>Your bank details are only shared with group organizers for payout purposes.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
