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
    <aside className="w-full md:w-64 bg-gray-800 text-white p-3 md:p-6 flex flex-row md:flex-col h-auto md:h-screen items-center md:items-stretch md:justify-between">
      <div className="w-full flex flex-row md:flex-col items-center md:items-start md:gap-10">
        <h2 className="text-lg md:text-xl font-bold mb-0 md:mb-6 flex items-center gap-3 w-auto md:w-full">
          <Link to={'/home'} className="cursor-pointer">
            {' '}
            <IoIosArrowBack />{' '}
          </Link>
          Back to home
        </h2>
        <ul className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-6 ml-4 md:ml-0 w-full">
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
