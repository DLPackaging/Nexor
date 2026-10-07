import React, { useState } from 'react';
import {
  Grid,
  Bookmark,
  Film,
  Settings,
  Edit3,
  CheckCircle2,
  ExternalLink,
  Share2,
  Tag,
  X,
  Sparkles,
  Camera
} from 'lucide-react';
import { useSocial, MaterialThemeColor } from '../context/SocialContext';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    posts,
    setActivePostDetail,
    themeColor,
    setThemeColor,
    androidNavType,
    setAndroidNavType,
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'grid' | 'saved' | 'reels' | 'tagged'>('grid');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Edit form state
  const [editName, setEditName] = useState(currentUser?.displayName || 'Alex Mercer');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editWebsite, setEditWebsite] = useState(currentUser?.website || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');

  // Posts created by this user
  const userPosts = posts.filter(p => p && p.id && p.userId === currentUser?.id);
  // Saved posts
  const savedPosts = posts.filter(p => p && p.id && p.isSaved);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      displayName: editName.trim(),
      bio: editBio.trim(),
      website: editWebsite.trim() || undefined,
      avatar: editAvatar.trim(),
    });
    setIsEditModalOpen(false);
    showToast('Profile updated successfully!');
  };

  const handleShareProfile = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast('Profile link copied to clipboard!');
  };

  return (
    <div id="profile-screen" className="relative flex-1 overflow-y-auto no-scrollbar bg-neutral-950 flex flex-col">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-neutral-800 text-neutral-100 text-xs px-4 py-2 rounded-full shadow-lg border border-neutral-700 flex items-center gap-1.5 animate-fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md px-4 py-3 border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base text-neutral-100">{currentUser?.username || 'user'}</span>
          {currentUser?.verified && (
            <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400/20" />
          )}
        </div>

        <button
          id="profile-settings-btn"
          onClick={() => setIsSettingsOpen(true)}
          className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Bio Section */}
      <div className="p-4 border-b border-neutral-800/60">
        {/* Avatar & Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="relative group">
            <div className="w-18 h-18 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-full h-full rounded-full object-cover bg-neutral-900"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-indigo-500 text-white shadow-md hover:bg-indigo-600 transition"
              title="Change Profile Picture"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-5 sm:gap-6 text-center pr-2">
            <div>
              <span className="block text-sm font-extrabold text-neutral-100">
                {currentUser.postsCount}
              </span>
              <span className="text-[11px] text-neutral-400">Posts</span>
            </div>
            <div>
              <span className="block text-sm font-extrabold text-neutral-100">
                {(currentUser.followersCount / 1000).toFixed(1)}k
              </span>
              <span className="text-[11px] text-neutral-400">Followers</span>
            </div>
            <div>
              <span className="block text-sm font-extrabold text-neutral-100">
                {currentUser.followingCount}
              </span>
              <span className="text-[11px] text-neutral-400">Following</span>
            </div>
          </div>
        </div>

        {/* Name & Bio */}
        <div className="space-y-1 mb-3">
          <h2 className="text-xs font-bold text-neutral-100">{currentUser.displayName}</h2>
          <p className="text-xs text-neutral-300 whitespace-pre-line leading-relaxed">
            {currentUser.bio}
          </p>
          {currentUser.website && (
            <a
              href={currentUser.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:underline pt-0.5"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{currentUser.website.replace('https://', '')}</span>
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="edit-profile-btn"
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-xs font-semibold text-neutral-200 border border-neutral-700/60 transition flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={handleShareProfile}
            className="flex-1 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-xs font-semibold text-neutral-200 border border-neutral-700/60 transition flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Tabs Navigation */}
      <div className="flex items-center justify-around border-b border-neutral-800/80 bg-neutral-900/30">
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-2.5 flex items-center justify-center transition border-b-2 ${
            activeTab === 'grid'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
          aria-label="Posts grid"
        >
          <Grid className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex-1 py-2.5 flex items-center justify-center transition border-b-2 ${
            activeTab === 'reels'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
          aria-label="Reels"
        >
          <Film className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-2.5 flex items-center justify-center transition border-b-2 ${
            activeTab === 'saved'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
          aria-label="Saved posts"
        >
          <Bookmark className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('tagged')}
          className={`flex-1 py-2.5 flex items-center justify-center transition border-b-2 ${
            activeTab === 'tagged'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
          aria-label="Tagged posts"
        >
          <Tag className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Content */}
      <div className="flex-1 p-1">
        {activeTab === 'grid' && (
          userPosts.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No posts shared yet. Tap "+" to create your first Android post!
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {userPosts.filter(p => p && p.id).map(post => (
                <div
                  key={post.id}
                  onClick={() => setActivePostDetail(post)}
                  className="relative aspect-square cursor-pointer overflow-hidden bg-neutral-900 group"
                >
                  <img
                    src={post.mediaUrls && post.mediaUrls[0] ? post.mediaUrls[0] : ''}
                    alt="User post"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                  />
                  {post.mediaUrls && post.mediaUrls.length > 1 && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white shadow-sm" />
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'saved' && (
          savedPosts.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No saved posts yet. Tap the bookmark icon on posts you love.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {savedPosts.filter(p => p && p.id).map(post => (
                <div
                  key={post.id}
                  onClick={() => setActivePostDetail(post)}
                  className="relative aspect-square cursor-pointer overflow-hidden bg-neutral-900 group"
                >
                  <img
                    src={post.mediaUrls && post.mediaUrls[0] ? post.mediaUrls[0] : ''}
                    alt="Saved post"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'reels' && (
          <div className="grid grid-cols-3 gap-1">
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-end p-2">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80"
                alt="Reel preview"
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="relative z-10 text-[10px] text-white font-bold drop-shadow">
                ▶ 14.2k
              </span>
            </div>
          </div>
        )}

        {activeTab === 'tagged' && (
          <div className="py-12 text-center text-xs text-neutral-500">
            Photos and reels you are tagged in will appear here.
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 max-w-sm w-full text-neutral-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
              <h3 className="text-sm font-bold text-neutral-100">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                  Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={editWebsite}
                  onChange={e => setEditWebsite(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                  Avatar Photo URL
                </label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={e => setEditAvatar(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-xs font-semibold text-white transition shadow-md shadow-indigo-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl p-5 max-w-sm w-full text-neutral-100 shadow-2xl animate-fade-in">
            <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
              <h3 className="text-sm font-bold text-neutral-100">Android App Settings</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Material You Accent */}
              <div>
                <span className="font-semibold text-neutral-300 block mb-2">
                  Material You Dynamic Color
                </span>
                <div className="flex items-center gap-2">
                  {(['indigo', 'violet', 'emerald', 'amber', 'cyan'] as MaterialThemeColor[]).map(
                    c => (
                      <button
                        key={c}
                        onClick={() => setThemeColor(c)}
                        className={`w-6 h-6 rounded-full capitalize transition ${
                          c === 'indigo'
                            ? 'bg-indigo-500'
                            : c === 'violet'
                            ? 'bg-violet-500'
                            : c === 'emerald'
                            ? 'bg-emerald-500'
                            : c === 'amber'
                            ? 'bg-amber-500'
                            : 'bg-cyan-500'
                        } ${themeColor === c ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                        title={c}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Navigation Style */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <span className="text-neutral-300">Android Navigation Style</span>
                <select
                  value={androidNavType}
                  onChange={e => setAndroidNavType(e.target.value as any)}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1 text-neutral-200"
                >
                  <option value="gesture">Gesture Bar</option>
                  <option value="buttons">3-Button Nav</option>
                </select>
              </div>

              {/* Version info */}
              <div className="pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 flex items-center justify-between">
                <span>Nexus Social for Android</span>
                <span>v2.4.0 (API 35)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
