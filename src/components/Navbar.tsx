import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { auth } from '../firebase';
import { LogOut, PlusCircle, User as UserIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-[#0066FF]">
          Ajo<span className="text-[#1A1A1A]">Digital</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-[#0066FF] transition-colors">
                Dashboard
              </Link>
              <Link to="/profile" className="text-sm font-medium hover:text-[#0066FF] transition-colors">
                Profile
              </Link>
              <Link to="/create-group" className="flex items-center gap-2 text-sm font-medium hover:text-[#0066FF] transition-colors">
                <PlusCircle size={18} />
                <span>Create Group</span>
              </Link>
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-gray-300" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon size={16} className="text-gray-500" />
                  </div>
                )}
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/auth" className="btn-primary">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
