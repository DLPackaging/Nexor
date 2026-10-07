import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  CheckCheck,
  ChevronLeft
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    posts,
    setActivePostDetail,
    toggleFollowUser,
  } = useSocial();

  const [activeFilter, setActiveFilter] = useState<'all' | 'like' | 'comment' | 'follow' | 'mention'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-400" />;
      case 'mention':
        return <AtSign className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return null;
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    if (!notif) return;
    if (notif.id) markNotificationRead(notif.id);
    if (notif.postId) {
      const foundPost = posts.find(p => p && p.id === notif.postId);
      if (foundPost) {
        setActivePostDetail(foundPost);
      }
    }
  };

  return (
    <div id="notifications-screen" className="flex-1 overflow-y-auto no-scrollbar bg-neutral-950 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md px-4 py-3 border-b border-neutral-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className="p-1 text-neutral-400 hover:text-white rounded-full"
              aria-label="Back to feed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-extrabold text-neutral-100">Activity</h2>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'like', label: 'Likes' },
            { id: 'comment', label: 'Comments' },
            { id: 'follow', label: 'Follows' },
            { id: 'mention', label: 'Mentions' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium shrink-0 transition ${
                activeFilter === f.id
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-2 space-y-1">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            No notifications in this category
          </div>
        ) : (
          filteredNotifications.filter(n => n && n.id).map(notif => {
            const notifUser = notif.user || {
              id: 'unknown',
              username: 'user',
              displayName: 'User',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
              isFollowing: false,
            };

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition ${
                  notif.read ? 'hover:bg-neutral-900/60' : 'bg-neutral-900/80 border border-indigo-500/20'
                }`}
              >
                <div className="flex items-center gap-3 pr-2">
                  {/* Avatar with type badge */}
                  <div className="relative">
                    <img
                      src={notifUser.avatar}
                      alt={notifUser.username}
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
                      {getIcon(notif.type)}
                    </div>
                  </div>

                  <div className="text-xs">
                    <p className="text-neutral-200 leading-snug">
                      <span className="font-bold text-neutral-100 mr-1">
                        {notifUser.displayName}
                      </span>
                      {notif.type === 'like' && 'liked your post.'}
                      {notif.type === 'comment' && 'commented on your photo.'}
                      {notif.type === 'follow' && 'started following you.'}
                      {notif.type === 'mention' && 'mentioned you in a update.'}
                    </p>
                    {notif.content && (
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {notif.content}
                      </p>
                    )}
                    <span className="text-[10px] text-neutral-500 block mt-0.5">
                      {notif.createdAt}
                    </span>
                  </div>
                </div>

                {/* Action: Post Image Thumbnail OR Follow button */}
                {notif.postImage ? (
                  <img
                    src={notif.postImage}
                    alt="Notification post"
                    className="w-10 h-10 rounded-lg object-cover shrink-0 border border-neutral-800"
                    referrerPolicy="no-referrer"
                  />
                ) : notif.type === 'follow' ? (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (notifUser.id) {
                        toggleFollowUser(notifUser.id);
                      }
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition shrink-0 ${
                      notifUser.isFollowing
                        ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                        : 'bg-indigo-500 text-white'
                    }`}
                  >
                    {notifUser.isFollowing ? 'Following' : 'Follow Back'}
                  </button>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
