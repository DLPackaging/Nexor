export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  website?: string;
  verified?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  mediaType: 'image' | 'carousel';
  mediaUrls: string[];
  caption: string;
  tags: string[];
  location?: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  isSaved: boolean;
  sharesCount: number;
  comments: Comment[];
  aspectRatio?: string;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  duration?: number;
  createdAt: string;
  viewed: boolean;
  caption?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  isAudio?: boolean;
  audioDuration?: string;
}

export interface ChatConversation {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  typing?: boolean;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  postImage?: string;
  content?: string;
  createdAt: string;
  read: boolean;
  postId?: string;
}

export interface Reel {
  id: string;
  user: User;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  audioTitle: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
}

export type TabType = 'home' | 'explore' | 'reels' | 'messages' | 'notifications' | 'profile';
