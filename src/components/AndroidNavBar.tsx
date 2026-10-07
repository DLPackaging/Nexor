import React from 'react';
import { Home, Compass, PlusCircle, Film, User } from 'lucide-react';
import { TabType } from '../types';
import { useSocial } from '../context/SocialContext';

export const AndroidNavBar: React.FC = () => {
  const { activeTab, setActiveTab, setIsCreateModalOpen, currentUser, themeColor } = useSocial();

  const getThemeAccent = () => {
    switch (themeColor) {
      case 'violet': return 'bg-violet-500/20 text-violet-400';
      case 'emerald': return 'bg-emerald-500/20 text-emerald-400';
      case 'amber': return 'bg-amber-500/20 text-amber-400';
      case 'cyan': return 'bg-cyan-500/20 text-cyan-400';
      case 'indigo':
      default: return 'bg-indigo-500/20 text-indigo-400';
    }
  };

  const getPillActive = (tab: TabType) => {
    return activeTab === tab ? getThemeAccent() : 'text-neutral-400 hover:text-neutral-200';
  };

  return (
    <nav
      id="android-bottom-nav"
      className="shrink-0 w-full bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800/80 px-4 py-2 z-30"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          id="nav-tab-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 ${getPillActive('home')}`}
          aria-label="Home Feed"
        >
          <Home className="w-5 h-5" strokeWidth={activeTab === 'home' ? 2.5 : 1.8} />
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </button>

        {/* Explore */}
        <button
          id="nav-tab-explore"
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 ${getPillActive('explore')}`}
          aria-label="Explore"
        >
          <Compass className="w-5 h-5" strokeWidth={activeTab === 'explore' ? 2.5 : 1.8} />
          <span className="text-[10px] font-medium mt-0.5">Explore</span>
        </button>

        {/* Create Button */}
        <button
          id="nav-tab-create"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 group"
          aria-label="Create Post"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 active:scale-95 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-neutral-900 rounded-[14px] flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </button>

        {/* Reels */}
        <button
          id="nav-tab-reels"
          onClick={() => setActiveTab('reels')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 ${getPillActive('reels')}`}
          aria-label="Reels"
        >
          <Film className="w-5 h-5" strokeWidth={activeTab === 'reels' ? 2.5 : 1.8} />
          <span className="text-[10px] font-medium mt-0.5">Reels</span>
        </button>

        {/* Profile */}
        <button
          id="nav-tab-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 ${getPillActive('profile')}`}
          aria-label="Profile"
        >
          <div className={`w-6 h-6 rounded-full overflow-hidden p-0.5 ${activeTab === 'profile' ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-neutral-900' : ''}`}>
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-full h-full text-neutral-400" />
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
};
