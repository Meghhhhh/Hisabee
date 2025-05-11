import React from 'react';
import { Link } from 'react-router';
import { IoIosArrowBack } from 'react-icons/io';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'overview', label: 'Profile Overview' },
    { key: 'history', label: 'History' },
    { key: 'friends', label: 'Friends' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <Link to={'/home'} className="cursor-pointer">
          {' '}
          <IoIosArrowBack />{' '}
        </Link>
        Back to home
      </h2>
      <ul className="space-y-2">
        {tabs.map(tab => (
          <li key={tab.key}>
            <button
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === tab.key ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
