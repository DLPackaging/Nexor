import React, { useState } from 'react';
import { Search, TrendingUp, Play, Film, X, CheckCircle2 } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { EXPLORE_CATEGORIES, EXPLORE_GRID_ITEMS } from '../data/mockData';

export const ExploreView: React.FC = () => {
  const { posts, users, setActivePostDetail, toggleFollowUser } = useSocial();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For You');

  const filteredUsers = users.filter(
    u =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(
    p =>
      p && (
        (p.caption && p.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (Array.isArray(p.tags) && p.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
      )
  );

  return (
    <div id="explore-screen" className="flex-1 overflow-y-auto no-scrollbar bg-neutral-950 flex flex-col">
      {/* Search Header */}
      <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md px-4 py-2.5 border-b border-neutral-800/80">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
          <input
            id="explore-search-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search accounts, tags, or places..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-9 pr-8 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        {!searchQuery && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-1">
            {EXPLORE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium shrink-0 transition ${
                  selectedCategory === cat
                    ? 'bg-neutral-100 text-neutral-900 font-semibold shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* If Searching: Render matching Accounts & Posts */}
      {searchQuery ? (
        <div className="p-4 space-y-4">
          {/* Matching Creators */}
          {filteredUsers.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Accounts
              </h3>
              <div className="space-y-2">
                {filteredUsers.filter(u => u && u.id).map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-900/60 border border-neutral-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-neutral-100">
                            {user.displayName}
                          </span>
                          {user.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-400">@{user.username}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFollowUser(user.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        user.isFollowing
                          ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                          : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                      }`}
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Posts */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Posts ({filteredPosts.length})
            </h3>
            {filteredPosts.length === 0 ? (
              <p className="text-xs text-neutral-500 py-6 text-center">No posts found matching "{searchQuery}"</p>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {filteredPosts.filter(p => p && p.id).map(p => (
                  <div
                    key={p.id}
                    onClick={() => setActivePostDetail(p)}
                    className="relative aspect-square cursor-pointer overflow-hidden bg-neutral-900 group"
                  >
                    <img
                      src={p.mediaUrls && p.mediaUrls[0] ? p.mediaUrls[0] : ''}
                      alt="Explore item"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Default Explore Bento Grid & Trending Section */
        <div className="p-1 space-y-3">
          {/* Trending Android Topics Pill */}
          <div className="px-3 py-2 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-neutral-900 border border-indigo-500/20 rounded-2xl mx-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-xs font-bold text-neutral-200">Trending on Android</span>
                <p className="text-[10px] text-neutral-400">#Android15, #JetpackCompose, #PixelDrop</p>
              </div>
            </div>
            <button
              onClick={() => setSearchQuery('#Android')}
              className="text-[11px] font-semibold text-indigo-400 hover:underline"
            >
              Explore
            </button>
          </div>

          {/* Staggered Grid of Photos & Reels */}
          <div className="grid grid-cols-3 gap-1 px-1">
            {EXPLORE_GRID_ITEMS.map((item, idx) => {
              // Connect click to a real post if possible
              const linkedPost = (posts && posts.length > 0) ? posts[idx % posts.length] : null;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (linkedPost) {
                      setActivePostDetail(linkedPost);
                    }
                  }}
                  className={`relative cursor-pointer overflow-hidden bg-neutral-900 group ${
                    idx === 1 || idx === 6 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    referrerPolicy="no-referrer"
                  />

                  {/* Reel indicator icon if reel type */}
                  {item.type === 'reel' && (
                    <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/50 backdrop-blur-sm text-white">
                      <Film className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Likes Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                    <span>❤️ {item.likes.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
