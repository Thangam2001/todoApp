import { auth } from '../lib/firebase';
import { LogOut, User as UserIcon, CheckSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  user: any;
  onNavigate: (view: 'dashboard' | 'profile') => void;
}

export default function Navbar({ user, onNavigate }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between glass-card px-6 py-3">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <div className="bg-primary p-2 rounded-lg">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span>Premium Todo</span>
        </button>

        {user && (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 btn-ghost"
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </button>
            <button 
              onClick={() => auth.signOut()}
              className="flex items-center gap-2 btn-ghost text-accent hover:text-accent"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
               {user.photoURL ? (
                 <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               ) : (
                 <UserIcon className="w-4 h-4 text-primary" />
               )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
