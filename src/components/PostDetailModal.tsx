import React from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { PostCard } from './PostCard';

export const PostDetailModal: React.FC = () => {
  const { activePostDetail, setActivePostDetail } = useSocial();

  if (!activePostDetail || !activePostDetail.id) return null;

  return (
    <div
      id="post-detail-modal"
      className="absolute inset-0 z-50 bg-neutral-950/95 backdrop-blur-sm flex flex-col justify-between overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-800 bg-neutral-900/80 shrink-0">
        <button
          onClick={() => setActivePostDetail(null)}
          className="flex items-center gap-1 text-xs text-neutral-300 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-semibold">Post</span>
        </button>

        <button
          onClick={() => setActivePostDetail(null)}
          className="p-1 text-neutral-400 hover:text-white rounded-full"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Post content scrollable area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <PostCard post={activePostDetail} />
      </div>
    </div>
  );
};
