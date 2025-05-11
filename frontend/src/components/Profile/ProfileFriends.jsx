import React from 'react';

const ProfileFriends = ({ friends }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Friends</h3>
    <div className="grid grid-cols-6 md:grid-cols-10 gap-4">
      {friends.map(friend => (
        <div key={friend.id} className="flex flex-col items-center">
          <img
            src={friend.avatar}
            alt={friend.name}
            className="w-16 h-16 rounded-full"
          />
          <span className="mt-2 text-sm">{friend.name}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileFriends;
