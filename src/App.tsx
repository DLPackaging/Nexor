import React from 'react';
import { SocialProvider, useSocial } from './context/SocialContext';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidNavBar } from './components/AndroidNavBar';
import { FeedView } from './components/FeedView';
import { ExploreView } from './components/ExploreView';
import { ReelsView } from './components/ReelsView';
import { MessagesView } from './components/MessagesView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { StoryViewer } from './components/StoryViewer';
import { CreatePostModal } from './components/CreatePostModal';
import { PostDetailModal } from './components/PostDetailModal';

const MainScreenContent: React.FC = () => {
  const { activeTab, activeStoryIndex, activeChatId } = useSocial();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <FeedView />;
      case 'explore':
        return <ExploreView />;
      case 'reels':
        return <ReelsView />;
      case 'messages':
        return <MessagesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <FeedView />;
    }
  };

  // Don't show bottom navigation bar when viewing stories or inside an active chat room
  const hideNavBar = activeStoryIndex !== null || (activeTab === 'messages' && activeChatId !== null);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-neutral-950">
      {/* Primary Tab View */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {renderActiveView()}
      </main>

      {/* Android Bottom Navigation Bar */}
      {!hideNavBar && <AndroidNavBar />}

      {/* Story Fullscreen Viewer Overlay */}
      <StoryViewer />

      {/* Create Post Modal Overlay */}
      <CreatePostModal />

      {/* Post Detail Modal Overlay */}
      <PostDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <SocialProvider>
      <AndroidFrame>
        <MainScreenContent />
      </AndroidFrame>
    </SocialProvider>
  );
}
