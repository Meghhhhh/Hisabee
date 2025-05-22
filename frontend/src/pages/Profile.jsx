import { useState } from 'react';
import Sidebar from '../components/Profile/Sidebar';
import ProfileOverview from '../components/Profile/ProfileOverview';
import ProfileHistory from '../components/Profile/ProfileHistory';
import ProfileFriends from '../components/Profile/ProfileFriends';
import { useSelector } from 'react-redux';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const user = useSelector(state => state.user);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProfileOverview user={user} />;
      case 'history':
        return <ProfileHistory history={user.history || []} />;
      case 'friends':
        return <ProfileFriends friends={user.friends || []} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 bg-gray-50">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Profile;
