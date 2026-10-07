import React, { useState } from 'react';
import {
  ChevronLeft,
  Phone,
  Video,
  Send,
  Mic,
  Image as ImageIcon,
  Check,
  CheckCheck,
  Play,
  Pause,
  Smile,
  Search
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';

export const MessagesView: React.FC = () => {
  const {
    conversations,
    activeChatId,
    setActiveChatId,
    sendMessage,
    currentUser,
    setActiveTab,
  } = useSocial();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<string | null>(null);

  const activeConversation = conversations.find(c => c && c.id === activeChatId);

  const filteredConversations = conversations.filter(c =>
    c && c.participant &&
    ((c.participant.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
     (c.participant.username || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId) return;
    sendMessage(activeChatId, messageInput.trim());
    setMessageInput('');
  };

  const handleSendVoice = () => {
    if (!activeChatId) return;
    sendMessage(activeChatId, '', true);
  };

  const triggerCallNotice = (type: 'Voice' | 'Video') => {
    const name = activeConversation?.participant?.displayName || 'User';
    setCallStatus(`${type} call connecting to ${name}...`);
    setTimeout(() => setCallStatus(null), 3000);
  };

  const togglePlayAudio = (id: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      setTimeout(() => setPlayingAudioId(null), 4000);
    }
  };

  // If in an active chat room:
  if (activeConversation) {
    const participant = activeConversation.participant || {
      id: 'unknown',
      username: 'user',
      displayName: 'User',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      bio: '',
    };

    return (
      <div id="chat-room-screen" className="flex-1 flex flex-col bg-neutral-950 overflow-hidden">
        {/* In-app Call Notice */}
        {callStatus && (
          <div className="bg-indigo-600 text-white text-xs px-4 py-2 text-center flex items-center justify-center gap-2">
            <Phone className="w-3.5 h-3.5 animate-bounce" />
            <span>{callStatus}</span>
          </div>
        )}

        {/* Chat Room Header */}
        <div className="px-3 py-2.5 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChatId(null)}
              className="p-1 text-neutral-300 hover:text-white rounded-full transition active:scale-95"
              aria-label="Back to conversations"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="relative">
              <img
                src={participant.avatar}
                alt={participant.username}
                className="w-9 h-9 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              {activeConversation.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-neutral-900" />
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold text-neutral-100 leading-tight">
                {participant.displayName}
              </h3>
              <span className="text-[10px] text-neutral-400">
                {activeConversation.online ? 'Active now' : 'Active 1h ago'}
              </span>
            </div>
          </div>

          {/* Action Call icons */}
          <div className="flex items-center gap-2 text-neutral-300">
            <button
              onClick={() => triggerCallNotice('Voice')}
              className="p-2 hover:text-indigo-400 transition rounded-full hover:bg-neutral-800"
              aria-label="Voice call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => triggerCallNotice('Video')}
              className="p-2 hover:text-indigo-400 transition rounded-full hover:bg-neutral-800"
              aria-label="Video call"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Bubble Thread */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
          {/* User profile intro pill */}
          <div className="flex flex-col items-center py-4 border-b border-neutral-800/40 mb-2">
            <img
              src={participant.avatar}
              alt={participant.username}
              className="w-16 h-16 rounded-full object-cover mb-2 border border-neutral-700"
              referrerPolicy="no-referrer"
            />
            <span className="text-sm font-bold text-neutral-100">
              {participant.displayName}
            </span>
            <span className="text-xs text-neutral-400">@{participant.username}</span>
            <span className="text-[11px] text-neutral-500 mt-1 max-w-[200px] text-center">
              {participant.bio}
            </span>
          </div>

          {(activeConversation.messages || []).filter(msg => msg && msg.id).map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs ${
                  msg.isMe
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-neutral-800 text-neutral-100 rounded-bl-xs'
                }`}
              >
                {msg.isAudio ? (
                  // Voice Message Player
                  <div className="flex items-center gap-2 py-1">
                    <button
                      onClick={() => togglePlayAudio(msg.id)}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                    >
                      {playingAudioId === msg.id ? (
                        <Pause className="w-3.5 h-3.5 fill-white" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      )}
                    </button>
                    {/* Simulated Audio Waveform */}
                    <div className="flex items-center gap-0.5 h-4">
                      {[3, 6, 9, 4, 8, 12, 7, 5, 11, 4, 8, 3].map((h, i) => (
                        <div
                          key={i}
                          className={`w-0.5 bg-white/70 rounded-full transition-all ${
                            playingAudioId === msg.id ? 'animate-pulse' : ''
                          }`}
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-white/80">0:14</span>
                  </div>
                ) : (
                  <p className="leading-relaxed">{msg.text}</p>
                )}
              </div>

              {/* Timestamp & Status */}
              <div className="flex items-center gap-1 mt-0.5 text-[9px] text-neutral-500 px-1">
                <span>{msg.timestamp}</span>
                {msg.isMe && (
                  <span>
                    {msg.status === 'read' ? (
                      <CheckCheck className="w-3 h-3 text-indigo-400" />
                    ) : (
                      <Check className="w-3 h-3 text-neutral-500" />
                    )}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Input Area */}
        <form
          onSubmit={handleSend}
          className="p-2.5 bg-neutral-900/90 backdrop-blur-md border-t border-neutral-800/80 flex items-center gap-2"
        >
          {/* Quick Voice button */}
          <button
            type="button"
            onClick={handleSendVoice}
            className="p-2 rounded-full bg-neutral-800 text-neutral-300 hover:text-indigo-400 transition active:scale-95"
            title="Record & send voice message"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Text input */}
          <input
            type="text"
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-neutral-800/70 border border-neutral-700/50 rounded-full px-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          {/* Send */}
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="w-9 h-9 rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:pointer-events-none text-white flex items-center justify-center transition active:scale-95 shadow-md shadow-indigo-500/20"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // Conversation List View:
  return (
    <div id="messages-inbox-screen" className="flex-1 overflow-y-auto no-scrollbar bg-neutral-950 flex flex-col">
      {/* Messages Header */}
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
            <h2 className="text-base font-extrabold text-neutral-100">Direct Messages</h2>
          </div>
          <span className="text-xs font-semibold text-indigo-400">{conversations.length} chats</span>
        </div>

        {/* Search */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Online Users Avatar Row */}
      <div className="px-4 py-3 border-b border-neutral-800/60 flex items-center gap-3 overflow-x-auto no-scrollbar">
        {conversations.filter(c => c && c.id && c.participant).map(c => {
          const participant = c.participant;
          return (
            <button
              key={c.id}
              onClick={() => setActiveChatId(c.id)}
              className="flex flex-col items-center gap-1 shrink-0 group"
            >
              <div className="relative">
                <img
                  src={participant.avatar}
                  alt={participant.username}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-700 group-hover:border-indigo-500 transition"
                  referrerPolicy="no-referrer"
                />
                {c.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
                )}
              </div>
              <span className="text-[10px] text-neutral-300 font-medium truncate max-w-14">
                {(participant.displayName || 'User').split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Conversation Items */}
      <div className="p-2 space-y-1">
        {filteredConversations.filter(conv => conv && conv.id && conv.participant).map(conv => {
          const participant = conv.participant;
          return (
            <button
              key={conv.id}
              onClick={() => setActiveChatId(conv.id)}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-900 transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={participant.avatar}
                    alt={participant.username}
                    className="w-12 h-12 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-neutral-100">{participant.displayName}</h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 max-w-[190px] mt-0.5">
                    {conv.lastMessage}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[10px] text-neutral-500">{conv.lastMessageTime}</span>
                {conv.unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
