import React, { useState } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  MapPin,
  Tag,
  Sliders,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSocial } from '../context/SocialContext';

const PRESET_PHOTOS = [
  {
    name: 'Cyber Tokyo',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&q=80',
    tags: ['#Tokyo', '#StreetPhotography', '#NeonNight'],
  },
  {
    name: 'Nordic Peak',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1080&q=80',
    tags: ['#Nordic', '#Alps', '#Wanderlust'],
  },
  {
    name: 'Android Workspace',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1080&q=80',
    tags: ['#AndroidDev', '#MobileDesign', '#Workspace'],
  },
  {
    name: 'Modern Architecture',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=80',
    tags: ['#Architecture', '#Minimalism', '#Design'],
  },
];

const FILTERS = [
  { id: 'normal', name: 'Normal', css: '' },
  { id: 'vivid', name: 'Vivid', css: 'saturate-150 contrast-105' },
  { id: 'cyber', name: 'Cyber', css: 'hue-rotate-15 contrast-125' },
  { id: 'vintage', name: 'Vintage', css: 'sepia-50 contrast-90 brightness-95' },
  { id: 'noir', name: 'Noir', css: 'grayscale contrast-125' },
];

const AI_SUGGESTED_CAPTIONS = [
  {
    caption: 'Finding order and rhythm in the quiet morning light. A moment of pause before the creative rush begins.',
    tags: ['#MorningLight', '#Mindfulness', '#Aesthetic'],
  },
  {
    caption: 'Dialing in the micro-interactions on the new Android build. Every millisecond of spring curve matters. 📱✨',
    tags: ['#Android15', '#JetpackCompose', '#UIUX', '#MobileDev'],
  },
  {
    caption: 'High-contrast angles and concrete textures. Always looking up in this neon metropolis.',
    tags: ['#StreetView', '#UrbanLens', '#Cityscape', '#NightWalk'],
  },
];

export const CreatePostModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, addPost, setActiveTab } = useSocial();

  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(PRESET_PHOTOS[0].url);
  const [activeFilter, setActiveFilter] = useState<string>('normal');
  const [caption, setCaption] = useState<string>('');
  const [location, setLocation] = useState<string>('Android Dev HQ, Mountain View');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#Android', '#Design']);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  if (!isCreateModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiAssistant = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const randomSuggestion =
        AI_SUGGESTED_CAPTIONS[Math.floor(Math.random() * AI_SUGGESTED_CAPTIONS.length)];
      setCaption(randomSuggestion.caption);
      setSelectedTags(prev => Array.from(new Set([...prev, ...randomSuggestion.tags])));
      setIsGeneratingAi(false);
    }, 600);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhotoUrl) return;

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'],
    });

    addPost({
      mediaUrls: [selectedPhotoUrl],
      caption: caption || 'Shared from my Android device ✨',
      tags: selectedTags,
      location: location.trim() || undefined,
    });

    setIsCreateModalOpen(false);
    setActiveTab('home');
  };

  return (
    <div
      id="create-post-modal"
      className="absolute inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex flex-col justify-between overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/60 shrink-0">
        <button
          onClick={() => setIsCreateModalOpen(false)}
          className="p-1 text-neutral-400 hover:text-white rounded-full transition"
          aria-label="Cancel"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-bold text-neutral-100">New Android Post</h2>
        <button
          onClick={handleSubmit}
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition"
        >
          Share
        </button>
      </div>

      {/* Main Form Scrollable Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* Media Preview Box */}
        <div className="relative w-full aspect-square rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-inner flex items-center justify-center">
          <img
            src={selectedPhotoUrl}
            alt="Selected preview"
            className={`w-full h-full object-cover transition-all ${
              FILTERS.find(f => f.id === activeFilter)?.css || ''
            }`}
            referrerPolicy="no-referrer"
          />

          {/* Upload Button overlay */}
          <label className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-neutral-900/80 backdrop-blur-md text-white text-xs font-medium border border-neutral-700 hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Filter Selection Row */}
        <div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 mb-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Photo Filter</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition ${
                  activeFilter === f.id
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Gallery Choices */}
        <div>
          <span className="text-[11px] font-semibold text-neutral-400 block mb-2">
            Or pick aesthetic sample:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_PHOTOS.map(p => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setSelectedPhotoUrl(p.url);
                  setSelectedTags(p.tags);
                }}
                className={`group relative aspect-square rounded-xl overflow-hidden border transition ${
                  selectedPhotoUrl === p.url
                    ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <img
                  src={p.url}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute inset-x-0 bottom-0 bg-neutral-950/70 text-[9px] text-white p-0.5 truncate text-center">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Caption & AI Generator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-300">Caption</label>
            <button
              type="button"
              onClick={handleAiAssistant}
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold transition"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAi ? 'Generating...' : 'AI Caption Assistant'}</span>
            </button>
          </div>

          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Write a caption for your Android community..."
            rows={3}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Location Tag */}
        <div>
          <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
            Add Location
          </label>
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2">
            <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Where was this captured?"
              className="w-full bg-transparent text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Hashtags Selector */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 mb-2">
            <Tag className="w-3.5 h-3.5 text-neutral-400" />
            <span>Popular Tags</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              '#Android',
              '#Pixel15',
              '#Photography',
              '#TechLife',
              '#Minimalism',
              '#Design',
              '#Travel',
            ].map(tag => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition flex items-center gap-1 ${
                    active
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                      : 'bg-neutral-800/60 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  {active && <Check className="w-3 h-3" />}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
