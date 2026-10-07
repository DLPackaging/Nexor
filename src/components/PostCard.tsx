import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Trash2,
  Share2,
  Copy,
  Smile
} from 'lucide-react';
import { Post } from '../types';
import { useSocial } from '../context/SocialContext';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    toggleLikePost,
    toggleSavePost,
    addComment,
    toggleLikeComment,
    deletePost,
    currentUser,
    setActiveStoryIndex,
    stories,
  } = useSocial();

  const [currentMediaIdx, setCurrentMediaIdx] = useState(0);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);

  if (!post || !post.id) return null;

  const postUser = post.user || {
    id: post.userId || 'user_unknown',
    username: 'user',
    displayName: 'User',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: '',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
  };

  const mediaUrls: string[] = (Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0)
    ? post.mediaUrls.filter(url => typeof url === 'string' && url.trim().length > 0)
    : ((post as any).mediaUrl ? [(post as any).mediaUrl] : ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&q=80']);

  const safeMediaIdx = Math.min(Math.max(0, currentMediaIdx), Math.max(0, mediaUrls.length - 1));
  const currentMediaUrl = mediaUrls[safeMediaIdx] || mediaUrls[0] || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&q=80';

  const postTags: string[] = Array.isArray(post.tags) ? post.tags.filter(t => typeof t === 'string' && t.trim().length > 0) : [];
  const postCaption: string = typeof post.caption === 'string' ? post.caption : '';
  const likesCount: number = typeof post.likesCount === 'number' ? post.likesCount : 0;
  const commentsCount: number = typeof post.commentsCount === 'number'
    ? post.commentsCount
    : (Array.isArray(post.comments) ? post.comments.length : 0);
  const postComments = Array.isArray(post.comments) ? post.comments.filter(c => c && c.id) : [];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (!post.isLiked && post.id) {
        toggleLikePost(post.id);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    }
    setLastTap(now);
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (safeMediaIdx < mediaUrls.length - 1) {
      setCurrentMediaIdx(prev => prev + 1);
    }
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (safeMediaIdx > 0) {
      setCurrentMediaIdx(prev => prev - 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast('Post link copied to clipboard!');
    setShowMenu(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !post.id) return;
    addComment(post.id, commentInput);
    setCommentInput('');
    setShowComments(true);
  };

  const targetUserId = postUser.id || post.userId;
  const handleAvatarClick = () => {
    const storyIdx = stories.findIndex(s => s && (s.userId === targetUserId || s.user?.id === targetUserId));
    if (storyIdx !== -1) {
      setActiveStoryIndex(storyIdx);
    }
  };

  const hasStory = stories.some(s => s && (s.userId === targetUserId || s.user?.id === targetUserId));

  return (
    <article
      id={`post-card-${post.id}`}
      className="w-full bg-neutral-900 border-b border-neutral-800/80 mb-2 last:mb-0 transition-colors"
    >
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-neutral-800 text-neutral-100 text-xs px-4 py-2 rounded-full shadow-lg border border-neutral-700 animate-fade-in flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Post Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-2.5">
          {/* Avatar with Story gradient indicator */}
          <button
            onClick={handleAvatarClick}
            className={`relative p-0.5 rounded-full transition-transform active:scale-95 ${
              hasStory
                ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600'
                : 'bg-neutral-800'
            }`}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-900 p-0.5">
              <img
                src={postUser.avatar}
                alt={postUser.username}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </button>

          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-neutral-100">{postUser.username}</span>
              {postUser.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
              )}
            </div>
            {post.location && (
              <p className="text-[10px] text-neutral-400 leading-none mt-0.5">{post.location}</p>
            )}
          </div>
        </div>

        {/* 3-Dots Menu */}
        <div className="relative">
          <button
            id={`post-menu-btn-${post.id}`}
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-full hover:bg-neutral-800/80 transition"
            aria-label="Post options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div
              id={`post-dropdown-${post.id}`}
              className="absolute right-0 top-8 z-30 w-40 bg-neutral-800 border border-neutral-700/80 rounded-2xl shadow-xl py-1 text-xs text-neutral-200 overflow-hidden"
            >
              <button
                onClick={handleShare}
                className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-neutral-700/60 text-left"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Post</span>
              </button>
              <button
                onClick={handleShare}
                className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-neutral-700/60 text-left"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>
              <button
                onClick={() => {
                  toggleSavePost(post.id);
                  showToast(post.isSaved ? 'Removed from bookmarks' : 'Saved to bookmarks');
                  setShowMenu(false);
                }}
                className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-neutral-700/60 text-left"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{post.isSaved ? 'Unsave' : 'Bookmark'}</span>
              </button>

              {post.userId === currentUser?.id && (
                <button
                  onClick={() => {
                    deletePost(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-red-500/20 text-red-400 text-left border-t border-neutral-700/50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Post</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Media Container (with Double Tap to Like) */}
      <div
        id={`post-media-${post.id}`}
        onClick={handleDoubleTap}
        className="relative w-full aspect-square bg-neutral-950 overflow-hidden cursor-pointer select-none"
      >
        <img
          src={currentMediaUrl}
          alt={`Post by ${postUser.username}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Floating Heart animation on Double Tap */}
        {showHeartPop && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-heart-pop drop-shadow-2xl" />
          </div>
        )}

        {/* Carousel Navigation Arrows if multi-photo */}
        {mediaUrls.length > 1 && (
          <>
            {safeMediaIdx > 0 && (
              <button
                onClick={handlePrevMedia}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-neutral-900/70 backdrop-blur-sm text-white flex items-center justify-center hover:bg-neutral-900"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {safeMediaIdx < mediaUrls.length - 1 && (
              <button
                onClick={handleNextMedia}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-neutral-900/70 backdrop-blur-sm text-white flex items-center justify-center hover:bg-neutral-900"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {/* Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-neutral-950/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {mediaUrls.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === safeMediaIdx ? 'bg-white w-2.5' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action Bar */}
      <div className="px-3.5 pt-2.5 pb-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Like */}
            <button
              id={`like-btn-${post.id}`}
              onClick={() => toggleLikePost(post.id)}
              className="group flex items-center gap-1 transition active:scale-125"
              aria-label="Like post"
            >
              <Heart
                className={`w-6 h-6 transition-all duration-200 ${
                  post.isLiked
                    ? 'text-rose-500 fill-rose-500 scale-110'
                    : 'text-neutral-200 hover:text-rose-400'
                }`}
              />
            </button>

            {/* Comment */}
            <button
              id={`comment-btn-${post.id}`}
              onClick={() => setShowComments(!showComments)}
              className="text-neutral-200 hover:text-indigo-400 transition active:scale-95"
              aria-label="Comment on post"
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="text-neutral-200 hover:text-emerald-400 transition active:scale-95"
              aria-label="Share post"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Bookmark / Save */}
          <button
            id={`save-btn-${post.id}`}
            onClick={() => {
              toggleSavePost(post.id);
              showToast(post.isSaved ? 'Removed from saved' : 'Saved to your profile');
            }}
            className="text-neutral-200 hover:text-amber-400 transition active:scale-95"
            aria-label="Save post"
          >
            <Bookmark
              className={`w-5 h-5 ${post.isSaved ? 'text-amber-400 fill-amber-400' : ''}`}
            />
          </button>
        </div>

        {/* Likes Count */}
        <p className="text-xs font-bold text-neutral-100 mt-2">
          {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
        </p>

        {/* Caption */}
        <div className="text-xs text-neutral-200 mt-1">
          <span className="font-bold mr-1.5 text-neutral-100">{postUser.username}</span>
          <span>
            {showFullCaption || postCaption.length <= 100
              ? postCaption
              : `${postCaption.slice(0, 95)}...`}
          </span>
          {postCaption.length > 100 && (
            <button
              onClick={() => setShowFullCaption(!showFullCaption)}
              className="text-neutral-400 hover:text-neutral-200 text-xs ml-1 font-medium"
            >
              {showFullCaption ? 'less' : 'more'}
            </button>
          )}
        </div>

        {/* Hashtags */}
        {postTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {postTags.map((tag, idx) => (
              <span key={idx} className="text-[11px] font-medium text-indigo-400 hover:underline cursor-pointer">
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}

        {/* Comments Count & Toggle */}
        {commentsCount > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-[11px] text-neutral-400 hover:text-neutral-300 mt-1.5 block font-medium"
          >
            {showComments
              ? 'Hide comments'
              : `View all ${commentsCount} comments`}
          </button>
        )}

        {/* Comments list when opened */}
        {showComments && postComments.length > 0 && (
          <div className="mt-2 space-y-2 pt-2 border-t border-neutral-800/60 max-h-48 overflow-y-auto no-scrollbar">
            {postComments.map(c => {
              const commentUser = c.user || {
                id: 'unknown',
                username: 'user',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
              };
              return (
                <div key={c.id} className="flex items-start justify-between text-xs group">
                  <div className="flex items-start gap-2 pr-2">
                    <img
                      src={commentUser.avatar}
                      alt={commentUser.username}
                      className="w-5 h-5 rounded-full object-cover mt-0.5 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="font-semibold text-neutral-200 mr-1.5">
                        {commentUser.username}
                      </span>
                      <span className="text-neutral-300">{c.content}</span>
                      <span className="block text-[10px] text-neutral-500 mt-0.5">{c.createdAt}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleLikeComment(post.id, c.id)}
                    className="p-1 text-neutral-400 hover:text-rose-500 shrink-0"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        c.isLiked ? 'text-rose-500 fill-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Comment Input Form */}
        <form onSubmit={handleCommentSubmit} className="mt-2.5 pt-2 border-t border-neutral-800/50 flex items-center gap-2">
          <input
            type="text"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder="Add a comment on Android..."
            className="flex-1 bg-neutral-800/60 rounded-full px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 border border-neutral-700/30"
          />

          {/* Quick emoji shortcut */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCommentInput(prev => prev + '🔥')}
              className="text-xs hover:scale-125 transition"
            >
              🔥
            </button>
            <button
              type="button"
              onClick={() => setCommentInput(prev => prev + '❤️')}
              className="text-xs hover:scale-125 transition"
            >
              ❤️
            </button>
          </div>

          <button
            type="submit"
            disabled={!commentInput.trim()}
            className="text-xs font-semibold text-indigo-400 disabled:opacity-30 disabled:pointer-events-none hover:text-indigo-300 transition"
          >
            Post
          </button>
        </form>

        {/* Timestamp */}
        <span className="block text-[10px] text-neutral-500 mt-1.5 uppercase tracking-wider">
          {post.createdAt}
        </span>
      </div>
    </article>
  );
};
