import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Post,
  Story,
  Reel,
  ChatConversation,
  NotificationItem,
  TabType,
  Comment,
  ChatMessage
} from '../types';
import {
  CURRENT_USER,
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_REELS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export type MaterialThemeColor = 'indigo' | 'violet' | 'emerald' | 'amber' | 'cyan';

interface SocialContextType {
  currentUser: User;
  updateCurrentUser: (updated: Partial<User>) => void;
  users: User[];
  toggleFollowUser: (userId: string) => void;
  posts: Post[];
  addPost: (newPostData: {
    caption: string;
    mediaUrls: string[];
    tags: string[];
    location?: string;
  }) => void;
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;
  deletePost: (postId: string) => void;
  stories: Story[];
  markStoryViewed: (storyId: string) => void;
  addStory: (mediaUrl: string, caption?: string) => void;
  activeStoryIndex: number | null;
  setActiveStoryIndex: (index: number | null) => void;
  reels: Reel[];
  toggleLikeReel: (reelId: string) => void;
  conversations: ChatConversation[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, isAudio?: boolean) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  usePhoneFrame: boolean;
  setUsePhoneFrame: (use: boolean) => void;
  androidNavType: 'gesture' | 'buttons';
  setAndroidNavType: (type: 'gesture' | 'buttons') => void;
  themeColor: MaterialThemeColor;
  setThemeColor: (color: MaterialThemeColor) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  activePostDetail: Post | null;
  setActivePostDetail: (post: Post | null) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence state with robust fallback validation
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('android_social_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.id) return parsed;
      }
    } catch {
      // ignore
    }
    return CURRENT_USER;
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('android_social_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(u => u && u.id)) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_USERS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('android_social_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed
            .filter(p => p && p.id)
            .map(p => {
              const rawMedia = Array.isArray(p.mediaUrls) && p.mediaUrls.length > 0
                ? p.mediaUrls
                : (p.mediaUrl ? [p.mediaUrl] : ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&q=80']);
              const mediaUrls = rawMedia.filter((m: any) => typeof m === 'string' && m.trim().length > 0);
              return {
                ...p,
                mediaUrls: mediaUrls.length > 0 ? mediaUrls : ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&q=80'],
                caption: typeof p.caption === 'string' ? p.caption : '',
                tags: Array.isArray(p.tags) ? p.tags.filter(Boolean) : [],
                likesCount: typeof p.likesCount === 'number' ? p.likesCount : 0,
                commentsCount: typeof p.commentsCount === 'number' ? p.commentsCount : 0,
                user: (p.user && p.user.id) ? p.user : (INITIAL_USERS.find(u => u.id === p.userId) || CURRENT_USER),
                comments: Array.isArray(p.comments) ? p.comments.filter(c => c && c.id) : [],
              };
            });
          if (valid.length > 0) return valid;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_POSTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem('android_social_stories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed
            .filter(s => s && s.id)
            .map(s => ({
              ...s,
              user: (s.user && s.user.id) ? s.user : (INITIAL_USERS.find(u => u.id === s.userId) || CURRENT_USER),
            }));
          if (valid.length > 0) return valid;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_STORIES;
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    try {
      const saved = localStorage.getItem('android_social_reels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(r => r && r.id);
          if (valid.length > 0) return valid;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_REELS;
  });

  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem('android_social_convs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(c => c && c.id && c.participant && c.participant.id);
          if (valid.length > 0) return valid;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_CONVERSATIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('android_social_notifs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(n => n && n.id);
          if (valid.length > 0) return valid;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_NOTIFICATIONS;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [activePostDetail, setActivePostDetail] = useState<Post | null>(null);
  const [usePhoneFrame, setUsePhoneFrame] = useState<boolean>(true);
  const [androidNavType, setAndroidNavType] = useState<'gesture' | 'buttons'>('gesture');
  const [themeColor, setThemeColor] = useState<MaterialThemeColor>('indigo');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('android_social_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('android_social_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('android_social_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('android_social_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('android_social_convs', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('android_social_notifs', JSON.stringify(notifications));
  }, [notifications]);

  const updateCurrentUser = (updated: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updated }));
  };

  const toggleFollowUser = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u && u.id === userId) {
          const nextFollow = !u.isFollowing;
          return {
            ...u,
            isFollowing: nextFollow,
            followersCount: nextFollow ? u.followersCount + 1 : Math.max(0, u.followersCount - 1),
          };
        }
        return u;
      })
    );
  };

  const toggleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post && post.id === postId) {
          const nextLiked = !post.isLiked;
          return {
            ...post,
            isLiked: nextLiked,
            likesCount: nextLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );
  };

  const toggleSavePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post && post.id === postId) {
          return { ...post, isSaved: !post.isSaved };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    const newComment: Comment = {
      id: 'comment_' + Date.now(),
      postId,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        verified: currentUser.verified,
      },
      content: content.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setPosts(prev =>
      prev.map(post => {
        if (post && post.id === postId) {
          return {
            ...post,
            commentsCount: (post.commentsCount || 0) + 1,
            comments: [newComment, ...(post.comments || [])],
          };
        }
        return post;
      })
    );
  };

  const toggleLikeComment = (postId: string, commentId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post && post.id === postId) {
          return {
            ...post,
            comments: (post.comments || []).map(c => {
              if (c && c.id === commentId) {
                const nextLiked = !c.isLiked;
                return {
                  ...c,
                  isLiked: nextLiked,
                  likesCount: nextLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
                };
              }
              return c;
            }),
          };
        }
        return post;
      })
    );
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p && p.id !== postId));
    setCurrentUser(prev => ({
      ...prev,
      postsCount: Math.max(0, prev.postsCount - 1),
    }));
  };

  const addPost = (newPostData: {
    caption: string;
    mediaUrls: string[];
    tags: string[];
    location?: string;
  }) => {
    const newPost: Post = {
      id: 'post_' + Date.now(),
      userId: currentUser.id,
      user: currentUser,
      mediaType: newPostData.mediaUrls.length > 1 ? 'carousel' : 'image',
      mediaUrls: newPostData.mediaUrls,
      caption: newPostData.caption,
      tags: newPostData.tags,
      location: newPostData.location || 'Android Mobile Studio',
      createdAt: 'Just now',
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      isSaved: false,
      sharesCount: 0,
      comments: [],
      aspectRatio: 'aspect-4/5',
    };

    setPosts(prev => [newPost, ...prev]);
    setCurrentUser(prev => ({ ...prev, postsCount: prev.postsCount + 1 }));
  };

  const markStoryViewed = (storyId: string) => {
    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, viewed: true } : s))
    );
  };

  const addStory = (mediaUrl: string, caption?: string) => {
    const newStory: Story = {
      id: 'story_' + Date.now(),
      userId: currentUser.id,
      user: currentUser,
      mediaUrl,
      createdAt: 'Just now',
      viewed: false,
      caption,
    };
    setStories(prev => [newStory, ...prev]);
  };

  const toggleLikeReel = (reelId: string) => {
    setReels(prev =>
      prev.map(reel => {
        if (reel.id === reelId) {
          const nextLiked = !reel.isLiked;
          return {
            ...reel,
            isLiked: nextLiked,
            likesCount: nextLiked ? reel.likesCount + 1 : Math.max(0, reel.likesCount - 1),
          };
        }
        return reel;
      })
    );
  };

  const sendMessage = (conversationId: string, text: string, isAudio = false) => {
    if (!text.trim() && !isAudio) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: currentUser.id,
      text: isAudio ? 'Voice message (0:14)' : text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'delivered',
      isAudio,
    };

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: newMsg.text,
            lastMessageTime: 'Just now',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );

    // Realistic smart simulated reply after 1.5 seconds from friend!
    setTimeout(() => {
      const replies = [
        'Love that! Thanks for sharing 🙌',
        'Looks super crisp on my Android screen!',
        'Got it! Will review and ping you in a bit 🚀',
        'Haha totally agree! Can we collab on this?',
        'Brilliant capture! What camera settings did you use?',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const botMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        senderId: 'partner',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
        status: 'read',
      };

      setConversations(curr =>
        curr.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: botMsg.text,
              lastMessageTime: 'Just now',
              messages: [...conv.messages, botMsg],
            };
          }
          return conv;
        })
      );
    }, 1500);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n && n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => (n ? { ...n, read: true } : n)));
  };

  const unreadNotificationsCount = notifications.filter(n => n && !n.read).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c?.unreadCount || 0), 0);

  return (
    <SocialContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        users,
        toggleFollowUser,
        posts,
        addPost,
        toggleLikePost,
        toggleSavePost,
        addComment,
        toggleLikeComment,
        deletePost,
        stories,
        markStoryViewed,
        addStory,
        activeStoryIndex,
        setActiveStoryIndex,
        reels,
        toggleLikeReel,
        conversations,
        activeChatId,
        setActiveChatId,
        sendMessage,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        unreadMessagesCount,
        activeTab,
        setActiveTab,
        isCreateModalOpen,
        setIsCreateModalOpen,
        usePhoneFrame,
        setUsePhoneFrame,
        androidNavType,
        setAndroidNavType,
        themeColor,
        setThemeColor,
        darkMode,
        setDarkMode,
        activePostDetail,
        setActivePostDetail,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
