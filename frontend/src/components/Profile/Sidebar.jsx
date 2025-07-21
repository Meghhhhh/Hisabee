import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setUserData } from '../../../store/slice/userSlice';
import { setIsLoggedIn } from '../../../store/slice/isLoggedIn';
import { useDispatch } from 'react-redux';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tabs = [
    { key: 'overview', label: 'Profile Overview' },
    { key: 'history', label: 'History' },
    { key: 'friends', label: 'Friends' },
  ];

  const handleLogout = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API_URL}/user/logout`,
      {},
      { withCredentials: true },
    );
    dispatch(setUserData({}));
    dispatch(setIsLoggedIn(false));
    toast.success(res.data.message);
    navigate('/home');
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col h-screen justify-between">
      <div>
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
      </div>
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-8"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
