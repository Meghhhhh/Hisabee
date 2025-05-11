import React from 'react';

const ProfileHistory = ({ history }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">History</h3>
    <ul className="space-y-3">
      {history.map(item => (
        <li key={item.id} className="flex justify-between text-sm border-b pb-2">
          <span>{item.activity}</span>
          <span className="text-gray-400">{item.date}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default ProfileHistory;
