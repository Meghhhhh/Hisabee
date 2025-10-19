import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
  setNotifications,
  setFriendRequests,
} from '../../store/slice/userSlice.js';

const notificationTypes = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Friend requests', value: 'message' },
  { label: 'Alerts', value: 'alert' },
];

const iconMap = {
  message: '📧',
  alert: '⚠️',
  info: 'ℹ️',
  success: '✅',
  default: '🔔',
};

const Notifications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.user.notifications);
  const friendRequests = useSelector(state => state.user.friendRequests);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [addFriendLoading, setAddFriendLoading] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const [notiRes, outgoingRes, incomingRes] = await Promise.all([
          axios.get(`api/v1/notifications/getAll`, { withCredentials: true }),
          axios.get(`api/v1/user/outgoing-requests`, { withCredentials: true }),
          axios.get(`api/v1/user/incoming-requests`, { withCredentials: true }),
        ]);
        const notificationsData = (notiRes.data?.data || []).map(n => ({
          id: n.notification_id,
          type: n.type,
          title: n.title,
          content: n.message,
          time: new Date(n.created_at).toLocaleString(),
          read: n.is_read,
        }));
        dispatch(setNotifications(notificationsData));
        dispatch(setFriendRequests(outgoingRes.data?.data || []));
        setIncomingRequests(incomingRes.data?.data || []);
      } catch {
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [dispatch]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = id => {
    dispatch(
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n)),
      ),
    );
  };

  const markAllAsRead = () => {
    dispatch(setNotifications(prev => prev.map(n => ({ ...n, read: true }))));
  };

  const deleteNotification = id => {
    dispatch(setNotifications(prev => prev.filter(n => n.id !== id)));
  };

  const clearAll = () => {
    dispatch(setNotifications([]));
  };

  const handleAddFriend = async () => {
    setAddFriendLoading(true);
    try {
      const payload = { email: friendEmail };
      const res = await axios.post(`api/v1/user/add-friend`, payload, {
        withCredentials: true,
      });
      toast.success(res.data?.message || 'Friend request sent!');
      setAddFriendOpen(false);
      setFriendEmail('');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to send friend request',
      );
    } finally {
      setAddFriendLoading(false);
    }
  };

  const handleAccept = async friend_id => {
    try {
      await axios.post(
        `api/v1/user/accept-request`,
        { friend_id },
        { withCredentials: true },
      );
      toast.success('Friend request accepted!');
      setIncomingRequests(prev => prev.filter(r => r.user_id !== friend_id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept request');
    }
  };
  const handleReject = async friend_id => {
    try {
      await axios.post(
        `api/v1/user/reject-request`,
        { friend_id },
        { withCredentials: true },
      );
      toast.info('Friend request rejected.');
      setIncomingRequests(prev => prev.filter(r => r.user_id !== friend_id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject request');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl inline-block">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500/40 to-purple-500/40 flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-white/60 rounded-full"></div>
            </div>
            <h2 className="text-xl font-semibold text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text">
              Loading notifications...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto pb-12 px-2 sm:px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mt-6 sm:mt-10 mb-6 sm:mb-8">
          <div className="flex items-center w-full sm:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition mr-2"
              title="Back"
            >
              ←
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              Notifications
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            <div className="relative" title="Unread notifications">
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full text-xs px-2 py-0.5 font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setAddFriendOpen(true)}
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white text-3xl border-4 border-white/20 shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:ring-offset-2"
              title="Add Friend"
            >
              ＋
            </button>
          </div>
        </div>

        {/* Add Friend Dialog */}
        {addFriendOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/10 shadow-2xl w-full max-w-xs mx-2">
              <div className="font-bold text-lg mb-4 text-white">
                Add Friend
              </div>
              <input
                type="email"
                placeholder="Friend's Email"
                value={friendEmail}
                onChange={e => setFriendEmail(e.target.value)}
                disabled={addFriendLoading}
                className="w-full px-4 py-2 mb-4 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400/40 transition text-sm"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setAddFriendOpen(false)}
                  disabled={addFriendLoading}
                  className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFriend}
                  disabled={addFriendLoading || !friendEmail}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs and Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            {notificationTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all duration-200 text-xs sm:text-sm font-semibold ${
                  filter === type.value
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                    : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border font-medium text-xs sm:text-sm transition-all duration-200 ${
                unreadCount === 0
                  ? 'border-white/10 bg-white/5 text-gray-500 cursor-not-allowed'
                  : 'border-indigo-500 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
              }`}
            >
              ✔️ Mark all read
            </button>
            <button
              onClick={clearAll}
              disabled={notifications.length === 0}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border font-medium text-xs sm:text-sm transition-all duration-200 ${
                notifications.length === 0
                  ? 'border-white/10 bg-white/5 text-gray-500 cursor-not-allowed'
                  : 'border-pink-500 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20'
              }`}
            >
              🗑️ Clear all
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 sm:space-y-4">
          {/* Incoming friend requests (pending) */}
          {filter === 'message' &&
            incomingRequests.length > 0 &&
            incomingRequests.map(req => (
              <div
                key={req.user_id}
                className="backdrop-blur-sm bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
              >
                <span className="text-xl sm:text-2xl">📧</span>
                <div className="flex-1">
                  <div className="font-semibold text-base sm:text-lg text-white">
                    {req.name || req.email}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">
                    {req.email}
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-end sm:mr-4 gap-1 sm:gap-0">
                  <span className="text-indigo-400 text-xs mb-0 sm:mb-1">
                    Incoming
                  </span>
                  <span className="text-gray-400 text-xs">{req.status}</span>
                </div>
                {req.status === 'pending' && (
                  <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-0">
                    <button
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-md text-xs sm:text-base"
                      onClick={() => handleAccept(req.user_id)}
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-pink-500 text-pink-400 hover:bg-pink-500/10 transition-all duration-300 text-xs sm:text-base"
                      onClick={() => handleReject(req.user_id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          {/* Outgoing friend requests */}
          {filter === 'message' &&
            friendRequests.length > 0 &&
            friendRequests.map(req => (
              <div
                key={req.user_id}
                className="backdrop-blur-sm bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
              >
                <span className="text-xl sm:text-2xl">📧</span>
                <div className="flex-1">
                  <div className="font-semibold text-base sm:text-lg text-white">
                    {req.name || req.email}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">
                    {req.email}
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-end gap-1 sm:gap-0">
                  <span className="text-yellow-400 text-xs mb-0 sm:mb-1">
                    Outgoing
                  </span>
                  <span className="text-gray-400 text-xs">{req.status}</span>
                </div>
              </div>
            ))}
          {/* Notifications */}
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-md ${
                  notification.read
                    ? 'bg-white/5'
                    : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10'
                }`}
              >
                <span className="text-xl sm:text-2xl">
                  {iconMap[notification.type] || iconMap.default}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-base sm:text-lg text-white">
                    {notification.title}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">
                    {notification.content}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {notification.time}
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-0">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="px-2 sm:px-3 py-1 rounded-lg border border-indigo-500 text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 font-medium text-xs transition-all duration-200"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="px-2 sm:px-3 py-1 rounded-lg border border-pink-500 text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 font-medium text-xs transition-all duration-200"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          ) : filter === 'message' ? (
            friendRequests.length === 0 && incomingRequests.length === 0 ? (
              <div className="py-16 text-center text-gray-500 text-base sm:text-lg">
                No friend requests to display.
              </div>
            ) : null
          ) : filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-base sm:text-lg">
              No notifications to display.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
