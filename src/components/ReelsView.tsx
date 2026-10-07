import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Music,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Disc,
  Play,
  Pause
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';

export const ReelsView: React.FC = () => {
  const { reels, toggleLikeReel, toggleFollowUser } = useSocial();

  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeartPop, setShowHeartPop] = useState(false);

  const currentReel = (reels && reels.length > 0) ? (reels[currentReelIndex] || reels[0]) : null;

  if (!currentReel) {
    return (
      <div id="reels-screen" className="relative flex-1 bg-black flex items-center justify-center text-neutral-400 text-sm">
        No reels available
      </div>
    );
  }

  const reelUser = currentReel.user || {
    id: currentReel.userId || 'user_unknown',
    username: 'creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    verified: false,
    isFollowing: false,
  };

  const handleNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(prev => prev + 1);
    } else {
      setCurrentReelIndex(0); // loop back
    }
  };

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1);
    }
  };

  const handleDoubleTap = () => {
    if (!currentReel.isLiked && currentReel.id) {
      toggleLikeReel(currentReel.id);
    }
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 800);
  };

  return (
    <div id="reels-screen" className="relative flex-1 bg-black overflow-hidden flex flex-col justify-between select-none">
      {/* Immersive Reel Media */}
      <div
        onClick={handleDoubleTap}
        className="absolute inset-0 z-0 flex items-center justify-center cursor-pointer"
      >
        <img
          src={currentReel.thumbnailUrl}
          alt={currentReel.caption}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Floating Heart animation on Double Tap */}
        {showHeartPop && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-heart-pop drop-shadow-2xl" />
          </div>
        )}

        {/* Overlay Dark Gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-20 px-4 py-3 flex items-center justify-between text-white">
        <h2 className="text-base font-extrabold tracking-tight drop-shadow-md">Reels</h2>

        {/* Up / Down Navigation Controls */}
        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
          <button
            onClick={handlePrevReel}
            disabled={currentReelIndex === 0}
            className="p-1 hover:text-indigo-400 disabled:opacity-30"
            aria-label="Previous reel"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-bold px-1">
            {currentReelIndex + 1}/{reels.length}
          </span>
          <button
            onClick={handleNextReel}
            className="p-1 hover:text-indigo-400"
            aria-label="Next reel"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Play/Pause Toggle Indicator */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
      </button>

      {/* Right Side Action Rail */}
      <div className="relative z-20 self-end mr-3 mb-16 flex flex-col items-center gap-4 text-white">
        {/* Like */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => toggleLikeReel(currentReel.id)}
            className="p-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition active:scale-125"
            aria-label="Like reel"
          >
            <Heart
              className={`w-7 h-7 ${
                currentReel.isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'
              }`}
            />
          </button>
          <span className="text-[11px] font-bold mt-1 drop-shadow">
            {(currentReel.likesCount / 1000).toFixed(1)}k
          </span>
        </div>

        {/* Comment */}
        <div className="flex flex-col items-center">
          <button
            className="p-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition active:scale-95"
            aria-label="Comments"
          >
            <MessageCircle className="w-7 h-7" />
          </button>
          <span className="text-[11px] font-bold mt-1 drop-shadow">
            {currentReel.commentsCount}
          </span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => {
              navigator.clipboard?.writeText?.(window.location.href);
            }}
            className="p-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition active:scale-95"
            aria-label="Share reel"
          >
            <Send className="w-6 h-6" />
          </button>
          <span className="text-[11px] font-bold mt-1 drop-shadow">Share</span>
        </div>

        {/* Audio Disc Animation */}
        <div className="relative mt-2">
          <div className="w-9 h-9 rounded-full bg-neutral-900 border-2 border-neutral-700 overflow-hidden flex items-center justify-center animate-spin [animation-duration:4s]">
            <Disc className="w-6 h-6 text-neutral-300" />
          </div>
          <div className="absolute -top-2 -right-1 animate-bounce">
            <Music className="w-3 h-3 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Bottom Creator Info & Audio Title */}
      <div className="relative z-20 px-4 pb-4 text-white drop-shadow-md max-w-[80%]">
        {/* User Info */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={reelUser.avatar}
            alt={reelUser.username}
            className="w-9 h-9 rounded-full border border-white/80 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold">{reelUser.username}</span>
            {reelUser.verified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
            )}
          </div>
          <button
            onClick={() => {
              if (reelUser.id) {
                toggleFollowUser(reelUser.id);
              }
            }}
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-white/60 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition ml-1"
          >
            {reelUser.isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Caption */}
        <p className="text-xs text-neutral-100 font-medium line-clamp-2 mb-2 leading-snug">
          {currentReel.caption}
        </p>

        {/* Audio Track marquee simulation */}
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-300 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit">
          <Music className="w-3 h-3 text-indigo-400 shrink-0" />
          <span className="truncate">{currentReel.audioTitle}</span>
        </div>
      </div>
    </div>
  );
};
