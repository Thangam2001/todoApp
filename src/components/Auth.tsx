import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { motion } from 'motion/react';
import { LogIn, Github } from 'lucide-react';

export default function Auth() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 max-w-md w-full text-center space-y-8"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">Premium Todo</h1>
          <p className="text-white/60">Experience the most polished productivity tool.</p>
        </div>

        <div className="space-y-4 pt-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-4 rounded-2xl hover:bg-white/90 transition-all active:scale-95 shadow-xl"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          
          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-widest text-white/30">Trusted Access</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <p className="text-xs text-white/40">
            Secure, encrypted authentication via Google Cloud. 
            No separate registration needed.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
