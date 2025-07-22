import { useState } from 'react';
import Sidebar from '../components/Profile/Sidebar';
import ProfileOverview from '../components/Profile/ProfileOverview';
import ProfileHistory from '../components/Profile/ProfileHistory';
import ProfileFriends from '../components/Profile/ProfileFriends';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProfileOverview />;
      case 'history':
        return <ProfileHistory />;
      case 'friends':
        return <ProfileFriends />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white relative">
      {/* Animated blurred gradient background like Dashboard */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-8 relative z-10">
        <div className="w-full max-w-10xl backdrop-blur-sm bg-white/5 rounded-3xl p-2 md:p-4 border border-white/10 shadow-2xl mt-2 ">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Profile;
