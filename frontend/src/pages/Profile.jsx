import React, { useState } from 'react';
import Sidebar from '../components/Profile/Sidebar';
import ProfileOverview from '../components/Profile/ProfileOverview';
import ProfileHistory from '../components/Profile/ProfileHistory';
import ProfileFriends from '../components/Profile/ProfileFriends';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '1234567890',
    payment_method: 'einei@okhdfc',
    avatar: 'https://i.pravatar.cc/150?img=3',
    totalExpenses: '₹12,500',
    groups: 4,
    history: [
      { id: 1, activity: 'Paid ₹500 to Alice', date: '2025-04-28' },
      { id: 2, activity: 'Received ₹250 from Bob', date: '2025-04-26' },
      { id: 3, activity: 'Joined group "Trip to Goa"', date: '2025-04-25' },
    ],
    friends: [
      { id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/150?img=6' },
    ],
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProfileOverview user={user} />;
      case 'history':
        return <ProfileHistory history={user.history} />;
      case 'friends':
        return <ProfileFriends friends={user.friends} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 bg-gray-50">
        <div className="bg-white p-6 rounded-2xl shadow-md">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Profile;
