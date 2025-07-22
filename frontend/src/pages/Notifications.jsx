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
          axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/notifications/getAll`,
            { withCredentials: true },
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/user/outgoing-requests`,
            { withCredentials: true },
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/user/incoming-requests`,
            { withCredentials: true },
          ),
        ]);
        console.log(notiRes.data?.data);
        const notificationsData = (notiRes.data?.data || []).map(n => ({
          id: n.notification_id,
          type: n.type,
          title: n.title,
          content: n.message,
          time: new Date(n.created_at).toLocaleString(),
          read: n.is_read,
        }));
        console.log(notificationsData);
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
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/add-friend`,
        payload,
        { withCredentials: true },
      );
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
        `${import.meta.env.VITE_BACKEND_API_URL}/user/accept-request`,
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
        `${import.meta.env.VITE_BACKEND_API_URL}/user/reject-request`,
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
      <div style={{ padding: 32, textAlign: 'center' }}>
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'red' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh' }}>
      {/* Top Bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', fontSize: 22, marginRight: 16, cursor: 'pointer' }}
          title="Back"
        >
          ←
        </button>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 20 }}>Notifications</div>
        <div style={{ position: 'relative', marginRight: 16 }} title="Unread notifications">
          <span style={{ fontSize: 22 }}>🔔</span>
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: -6, right: -8, background: '#1976d2', color: '#fff', borderRadius: '50%', fontSize: 12, padding: '2px 6px', fontWeight: 600 }}>{unreadCount}</span>
          )}
        </div>
        <button
          onClick={() => setAddFriendOpen(true)}
          style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}
          title="Add Friend"
        >
          ➕
        </button>
      </div>

      {/* Add Friend Dialog */}
      {addFriendOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 8, minWidth: 320, maxWidth: 400, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Add Friend</div>
            <input
              type="email"
              placeholder="Friend's Email"
              value={friendEmail}
              onChange={e => setFriendEmail(e.target.value)}
              disabled={addFriendLoading}
              style={{ width: '100%', padding: 8, fontSize: 16, marginBottom: 16, border: '1px solid #ccc', borderRadius: 4 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => setAddFriendOpen(false)}
                disabled={addFriendLoading}
                style={{ padding: '6px 16px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddFriend}
                disabled={addFriendLoading || !friendEmail}
                style={{ padding: '6px 16px', borderRadius: 4, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 600, cursor: addFriendLoading || !friendEmail ? 'not-allowed' : 'pointer' }}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs and Actions */}
      <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {notificationTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                border: filter === type.value ? '2px solid #1976d2' : '1px solid #ccc',
                background: filter === type.value ? '#e3f0fd' : '#fff',
                color: filter === type.value ? '#1976d2' : '#333',
                fontWeight: filter === type.value ? 600 : 400,
                cursor: 'pointer',
                fontSize: 15,
                outline: 'none',
                minWidth: 80,
                transition: 'all 0.2s',
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid #1976d2',
              background: unreadCount === 0 ? '#eee' : '#fff',
              color: unreadCount === 0 ? '#aaa' : '#1976d2',
              fontWeight: 500,
              cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
              fontSize: 14,
            }}
          >
            ✔️ Mark all read
          </button>
          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid #d32f2f',
              background: notifications.length === 0 ? '#eee' : '#fff',
              color: notifications.length === 0 ? '#aaa' : '#d32f2f',
              fontWeight: 500,
              cursor: notifications.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: 14,
            }}
          >
            🗑️ Clear all
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ padding: 16, maxWidth: 700, margin: '0 auto' }}>
        {/* Incoming friend requests (pending) */}
        {filter === 'message' &&
          incomingRequests.length > 0 &&
          incomingRequests.map(req => (
            <div key={req.user_id} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, marginBottom: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 24 }}>📧</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{req.name || req.email}</div>
                <div style={{ color: '#666', fontSize: 14 }}>{req.email}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: 16 }}>
                <span style={{ color: '#0288d1', fontSize: 12, marginBottom: 4 }}>Incoming</span>
                <span style={{ color: '#888', fontSize: 12 }}>{req.status}</span>
              </div>
              {req.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    style={{ padding: '6px 12px', borderRadius: 4, border: 'none', background: '#43a047', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => handleAccept(req.user_id)}
                  >
                    Accept
                  </button>
                  <button
                    style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #d32f2f', background: '#fff', color: '#d32f2f', fontWeight: 600, cursor: 'pointer' }}
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
            <div key={req.user_id} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, marginBottom: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 24 }}>📧</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{req.name || req.email}</div>
                <div style={{ color: '#666', fontSize: 14 }}>{req.email}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ color: '#fbc02d', fontSize: 12, marginBottom: 4 }}>Outgoing</span>
                <span style={{ color: '#888', fontSize: 12 }}>{req.status}</span>
              </div>
            </div>
          ))}
        {/* Notifications */}
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              style={{
                background: notification.read ? '#f5f5f5' : '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                marginBottom: 16,
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: notification.read ? 'none' : '0 2px 8px rgba(0,0,0,0.07)',
              }}
            >
              <span style={{ fontSize: 24 }}>{iconMap[notification.type] || iconMap.default}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: '#222' }}>{notification.title}</div>
                <div style={{ color: '#666', fontSize: 14 }}>{notification.content}</div>
                <div style={{ color: '#aaa', fontSize: 12 }}>{notification.time}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #1976d2', background: '#fff', color: '#1976d2', fontWeight: 500, cursor: 'pointer', fontSize: 13 }}
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #d32f2f', background: '#fff', color: '#d32f2f', fontWeight: 500, cursor: 'pointer', fontSize: 13 }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : filter === 'message' ? (
          friendRequests.length === 0 && incomingRequests.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>
              No friend requests to display.
            </div>
          ) : null
        ) : filteredNotifications.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>
            No notifications to display.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Notifications;
