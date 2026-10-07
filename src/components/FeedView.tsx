import React, { useState } from 'react';
import { MessageCircle, Bell, Plus, Sparkles, RefreshCw } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { PostCard } from './PostCard';

export const FeedView: React.FC = () => {
  const {
    posts,
    stories,
    currentUser,
    setActiveStoryIndex,
    addStory,
    setActiveTab,
    unreadMessagesCount,
    unreadNotificationsCount,
  } = useSocial();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStoryUpload, setShowStoryUpload] = useState(false);
  const [storyImageUrl, setStoryImageUrl] = useState('');
  const [storyCaption, setStoryCaption] = useState('');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    const urlToUse =
      storyImageUrl.trim() ||
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
    addStory(urlToUse, storyCaption.trim() || undefined);
    setStoryImageUrl('');
    setStoryCaption('');
    setShowStoryUpload(false);
    // Automatically open user's newly created story
    setActiveStoryIndex(0);
  };

  return (
    <div id="feed-screen" className="flex-1 overflow-y-auto no-scrollbar bg-neutral-950 flex flex-col">
      {/* Android Top App Bar */}
      <div
        id="feed-top-bar"
        className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-neutral-800/80"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-sm shadow-indigo-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Nexus
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30">
            Android
          </span>
        </div>

        {/* Top Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Refresh Feed */}
          <button
            onClick={handleRefresh}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* Notifications */}
          <button
            id="open-notifications-btn"
            onClick={() => setActiveTab('notifications')}
            className="relative p-1.5 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-neutral-950 animate-pulse" />
            )}
          </button>

          {/* Direct Messages */}
          <button
            id="open-messages-btn"
            onClick={() => setActiveTab('messages')}
            className="relative p-1.5 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition"
            aria-label="Direct Messages"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-4 text-[10px] font-bold rounded-full bg-indigo-500 text-white ring-2 ring-neutral-950 flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stories Tray */}
      <div
        id="stories-tray"
        className="w-full py-3 px-3 overflow-x-auto no-scrollbar flex items-center gap-3 border-b border-neutral-800/80 bg-neutral-900/40"
      >
        {/* Your Story item */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <button
            onClick={() => setShowStoryUpload(true)}
            className="relative w-15 h-15 rounded-full p-0.5 bg-neutral-800 hover:opacity-90 active:scale-95 transition"
            aria-label="Add story"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full bg-indigo-500 ring-2 ring-neutral-950 text-white flex items-center justify-center">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          </button>
          <span className="text-[10px] text-neutral-300 font-medium truncate max-w-16">
            Your Story
          </span>
        </div>

        {/* Stories from following */}
        {stories.filter(s => s && s.id).map((story, index) => {
          const storyUser = story.user || {
            username: 'user',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
          };
          return (
            <div key={story.id} className="flex flex-col items-center gap-1 shrink-0">
              <button
                onClick={() => setActiveStoryIndex(index)}
                className={`w-15 h-15 rounded-full p-0.5 transition-transform active:scale-95 ${
                  story.viewed
                    ? 'ring-1 ring-neutral-700 bg-neutral-800'
                    : 'bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 ring-2 ring-offset-2 ring-offset-neutral-950 ring-transparent'
                }`}
                aria-label={`View story by ${storyUser.username}`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-950 p-0.5">
                  <img
                    src={storyUser.avatar}
                    alt={storyUser.username}
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </button>
              <span className="text-[10px] text-neutral-300 font-medium truncate max-w-16">
                {storyUser.username}
              </span>
            </div>
          );
        })}
      </div>

      {/* Story Upload Modal Popup */}
      {showStoryUpload && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl text-neutral-100">
            <h3 className="text-sm font-bold text-neutral-100 mb-1">Add to Your Story</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Share a moment with your followers for 24 hours.
            </p>

            <form onSubmit={handleAddStory} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-neutral-300 block mb-1">
                  Image URL (or use default)
                </label>
                <input
                  type="url"
                  value={storyImageUrl}
                  onChange={e => setStoryImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Sample quick story presets */}
              <div>
                <span className="text-[10px] text-neutral-400 block mb-1.5">Or choose a preset:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Tokyo Cafe', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80' },
                    { label: 'Cyber Tech', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' },
                    { label: 'Mountain Sun', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80' },
                  ].map(preset => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setStoryImageUrl(preset.url)}
                      className="p-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/60 text-[10px] text-neutral-300 truncate"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-300 block mb-1">
                  Story Caption (Optional)
                </label>
                <input
                  type="text"
                  value={storyCaption}
                  onChange={e => setStoryCaption(e.target.value)}
                  placeholder="What's happening today?"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStoryUpload(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:bg-neutral-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-xs font-semibold text-white transition shadow-md shadow-indigo-500/20"
                >
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Posts Feed */}
      <div className="flex-1 flex flex-col">
        {posts.filter(p => p && p.id).map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
