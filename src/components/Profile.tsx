import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { Mail, Calendar, User as UserIcon, ShieldCheck } from 'lucide-react';

interface ProfileProps {
  user: any;
}

export default function Profile({ user }: ProfileProps) {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card overflow-hidden"
      >
        <div className="h-32 bg-primary/20 relative">
          <div className="absolute -bottom-12 left-8 border-4 border-[#0f172a] rounded-full overflow-hidden w-24 h-24 bg-white/10 flex items-center justify-center">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon className="w-12 h-12 text-white/50" />
            )}
          </div>
        </div>

        <div className="pt-16 pb-8 px-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">{user.displayName || 'Anonymous User'}</h2>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
             <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Account Status</p>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified</span>
                </div>
             </div>
             <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Joined</p>
                <div className="flex items-center gap-2 text-white/70">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(user.metadata.creationTime).toLocaleDateString()}</span>
                </div>
             </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={() => auth.signOut()}
              className="w-full btn-ghost p-4 border border-white/5 hover:bg-accent/10 hover:text-accent font-semibold"
            >
              Sign Out from all devices
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
