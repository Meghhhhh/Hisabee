import React, { useState } from 'react';

const Notifications = () => {
  const initialNotifications = [
    {
      id: 1,
      type: 'message',
      title: 'New Message',
      content: 'Sarah sent you a message',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'alert',
      title: 'System Update',
      content: 'System maintenance scheduled for tonight',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Tips & Tricks',
      content: 'Check out the new features available in your dashboard',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Task Completed',
      content: 'Your file upload was successful',
      time: 'Yesterday',
      read: true
    },
    {
      id: 5,
      type: 'message',
      title: 'New Message',
      content: 'Mike commented on your post',
      time: '2 days ago',
      read: true
    }
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const markAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <span className="text-blue-500">💬</span>;
      case 'alert':
        return <span className="text-red-500">⚠️</span>;
      case 'info':
        return <span className="text-purple-500">ℹ️</span>;
      case 'success':
        return <span className="text-green-500">✅</span>;
      default:
        return <span className="text-gray-500">🔔</span>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Notifications</h1>
        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {unreadCount}
        </span>
      </div>

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('message')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'message' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Friend requests
            </button>
            <button
              onClick={() => setFilter('alert')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'alert' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Alerts
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              disabled={unreadCount === 0}
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              disabled={notifications.length === 0}
            >
              Clear all
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div key={notification.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getIcon(notification.type)}
                  <div>
                    <h3 className="font-medium text-gray-800">{notification.title}</h3>
                    <p className="text-sm text-gray-600">{notification.content}</p>
                    <span className="text-xs text-gray-400">{notification.time}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-500 hover:text-red-500 text-lg"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500 text-center">No notifications to display.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
