import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, Pause, Play } from 'lucide-react';
import { useSocial } from '../context/SocialContext';

export const StoryViewer: React.FC = () => {
  const {
    stories,
    activeStoryIndex,
    setActiveStoryIndex,
    markStoryViewed,
    sendMessage,
    conversations,
  } = useSocial();

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReactionEffect, setShowReactionEffect] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  const currentStory = (activeStoryIndex !== null && stories[activeStoryIndex]) ? stories[activeStoryIndex] : null;

  useEffect(() => {
    if (activeStoryIndex === null || !currentStory || !currentStory.id) return;
    markStoryViewed(currentStory.id);
    setProgress(0);

    const DURATION = 5000;
    const INTERVAL = 50;
    const step = (INTERVAL / DURATION) * 100;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + step;
        });
      }
    }, INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeStoryIndex, isPaused]);

  if (activeStoryIndex === null || !currentStory) return null;

  const storyUser = currentStory.user || {
    id: currentStory.userId || 'user_unknown',
    username: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
  };

  const handleNext = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  const targetUserId = storyUser.id || currentStory.userId;

  const handleReaction = (emoji: string) => {
    setShowReactionEffect(emoji);
    setTimeout(() => setShowReactionEffect(null), 1000);

    // Send reply to conversation if exists
    const conv = conversations.find(c => c && c.participant && c.participant.id === targetUserId);
    if (conv) {
      sendMessage(conv.id, `Reacted ${emoji} to your story`);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const conv = conversations.find(c => c && c.participant && c.participant.id === targetUserId);
    if (conv) {
      sendMessage(conv.id, `Replied to story: "${replyText.trim()}"`);
    }
    setReplyText('');
    setShowReactionEffect('Sent!');
    setTimeout(() => setShowReactionEffect(null), 1200);
  };

  return (
    <div
      id="story-viewer-modal"
      className="absolute inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Top Segmented Progress Bar */}
      <div className="absolute top-2 left-0 right-0 z-30 px-3 flex items-center gap-1">
        {stories.filter(s => s && s.id).map((s, idx) => {
          let barWidth = 0;
          if (idx < activeStoryIndex) barWidth = 100;
          else if (idx === activeStoryIndex) barWidth = progress;
          else barWidth = 0;

          return (
            <div
              key={s.id}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-75"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Story Header (User Info & Close) */}
      <div className="absolute top-5 left-0 right-0 z-30 px-4 py-2 flex items-center justify-between text-white drop-shadow-md">
        <div className="flex items-center gap-2.5">
          <img
            src={storyUser.avatar}
            alt={storyUser.username}
            className="w-8 h-8 rounded-full border border-white/80 object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="text-xs font-bold">{storyUser.username}</span>
            <span className="text-[10px] text-white/80 block">{currentStory.createdAt}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60"
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            id="close-story-btn"
            onClick={() => setActiveStoryIndex(null)}
            className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60"
            aria-label="Close story"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Story Image with Touch Navigation */}
      <div
        className="relative w-full h-full flex items-center justify-center bg-neutral-950"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <img
          src={currentStory.mediaUrl}
          alt="Story content"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Tap areas: Left 30% goes previous, Right 70% goes next */}
        <div
          onClick={handlePrev}
          className="absolute left-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
        />
        <div
          onClick={handleNext}
          className="absolute right-0 top-0 bottom-0 w-2/3 z-20 cursor-pointer"
        />

        {/* Floating reaction pop effect */}
        {showReactionEffect && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <span className="text-6xl animate-bounce drop-shadow-2xl">
              {showReactionEffect}
            </span>
          </div>
        )}

        {/* Story Caption Overlay */}
        {currentStory.caption && (
          <div className="absolute bottom-20 left-4 right-4 z-20 bg-black/60 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-white text-xs text-center font-medium">
            {currentStory.caption}
          </div>
        )}
      </div>

      {/* Bottom Reply Bar & Reactions */}
      <div className="absolute bottom-3 left-0 right-0 z-30 px-3 flex flex-col gap-2">
        {/* Quick Reaction Pills */}
        <div className="flex items-center justify-around bg-black/40 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/10">
          {['❤️', '🔥', '😂', '😮', '👏', '🎉'].map(emoji => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="text-lg hover:scale-125 active:scale-95 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Text Reply Input */}
        <form onSubmit={handleSendReply} className="flex items-center gap-2">
          <input
            type="text"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder={`Reply to ${storyUser.username}...`}
            className="flex-1 bg-white/20 backdrop-blur-md text-white placeholder-white/70 text-xs px-4 py-2.5 rounded-full border border-white/30 focus:outline-none focus:ring-1 focus:ring-white"
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="w-9 h-9 rounded-full bg-white text-neutral-900 flex items-center justify-center hover:bg-neutral-200 transition active:scale-95 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
