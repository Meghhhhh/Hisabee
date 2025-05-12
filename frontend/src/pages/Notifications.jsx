import React, { useState, useEffect } from 'react';

const Notifications = () => {
  // Mock notification data
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

  // Live tracking data
  const initialTrackingData = [
    {
      id: 't1',
      title: 'Package #28371',
      status: 'In Transit',
      lastUpdated: 'Just now',
      location: 'Chicago Distribution Center',
      eta: 'May 14, 2025, 10:30 AM',
      progress: 65,
      events: [
        { time: '10:30 AM', date: 'May 12, 2025', status: 'Departed from facility', location: 'Chicago Distribution Center' },
        { time: '8:15 AM', date: 'May 12, 2025', status: 'Arrived at sorting facility', location: 'Chicago Distribution Center' },
        { time: '6:42 PM', date: 'May 11, 2025', status: 'In transit', location: 'Indianapolis Warehouse' },
        { time: '1:23 PM', date: 'May 11, 2025', status: 'Shipment picked up', location: 'Cincinnati Hub' }
      ]
    },
    {
      id: 't2',
      title: 'Order #734958',
      status: 'Out for Delivery',
      lastUpdated: '15 minutes ago',
      location: 'Local Delivery Vehicle',
      eta: 'May 12, 2025, 3:45 PM (Today)',
      progress: 85,
      events: [
        { time: '8:42 AM', date: 'May 12, 2025', status: 'Out for delivery', location: 'Local Delivery Vehicle' },
        { time: '7:30 AM', date: 'May 12, 2025', status: 'Arrived at local facility', location: 'San Francisco Distribution Center' },
        { time: '10:15 PM', date: 'May 11, 2025', status: 'Departed regional hub', location: 'Oakland Sorting Facility' }
      ]
    }
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  const [trackingItems, setTrackingItems] = useState(initialTrackingData);
  const [filter, setFilter] = useState('all');
  const [expandedTrackingId, setExpandedTrackingId] = useState(null);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Simulate live updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Randomly update tracking statuses
      const shouldUpdate = Math.random() > 0.7; // 30% chance of update
      
      if (shouldUpdate) {
        setTrackingItems(prevItems => {
          const newItems = [...prevItems];
          const itemToUpdate = Math.floor(Math.random() * newItems.length);
          
          if (newItems[itemToUpdate].status === 'In Transit') {
            // Randomly progress to next stage or update location
            const randomProgress = Math.min(newItems[itemToUpdate].progress + Math.floor(Math.random() * 10), 100);
            
            if (randomProgress > 80) {
              newItems[itemToUpdate] = {
                ...newItems[itemToUpdate],
                status: 'Out for Delivery',
                lastUpdated: 'Just now',
                progress: randomProgress,
                events: [
                  { 
                    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
                    date: 'May 12, 2025', 
                    status: 'Out for delivery', 
                    location: 'Local Delivery Vehicle' 
                  },
                  ...newItems[itemToUpdate].events
                ]
              };
            } else {
              newItems[itemToUpdate] = {
                ...newItems[itemToUpdate],
                lastUpdated: 'Just now',
                progress: randomProgress
              };
            }
          } else if (newItems[itemToUpdate].status === 'Out for Delivery' && Math.random() > 0.7) {
            // Sometimes mark as delivered
            newItems[itemToUpdate] = {
              ...newItems[itemToUpdate],
              status: 'Delivered',
              lastUpdated: 'Just now',
              progress: 100,
              events: [
                { 
                  time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
                  date: 'May 12, 2025', 
                  status: 'Delivered', 
                  location: 'Front Door' 
                },
                ...newItems[itemToUpdate].events
              ]
            };
            
            // Add delivery notification
            setNotifications(prev => [
              {
                id: Date.now(),
                type: 'success',
                title: `${newItems[itemToUpdate].title} Delivered!`,
                content: `Your ${newItems[itemToUpdate].title} has been delivered successfully.`,
                time: 'Just now',
                read: false
              },
              ...prev
            ]);
          }
          
          return newItems;
        });
      }
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(updateInterval);
  }, []);

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

  const toggleTrackingDetails = (id) => {
    setExpandedTrackingId(expandedTrackingId === id ? null : id);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'tracking') return false; // Tracking items are shown separately
    return notification.type === filter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case 'alert':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Notifications</h1>
          <div className="flex space-x-2">
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          </div>
        </div>
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
              onClick={() => setFilter('tracking')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'tracking' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Tracking
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
        
        <div className="bg-white rounded-lg shadow">
          {filter === 'tracking' ? (
            // Tracking Items Display
            trackingItems.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {trackingItems.map((item) => (
                  <div key={item.id} className="p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleTrackingDetails(item.id)}
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          <div className={`p-2 rounded-full ${
                            item.status === 'Delivered' ? 'bg-green-100' : 
                            item.status === 'Out for Delivery' ? 'bg-blue-100' : 'bg-yellow-100'
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                              item.status === 'Delivered' ? 'text-green-500' : 
                              item.status === 'Out for Delivery' ? 'text-blue-500' : 'text-yellow-500'
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{item.title}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              item.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                              item.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">• Updated {item.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right mr-2">
                          <div className="text-sm font-medium text-gray-900">{item.eta}</div>
                          <div className="text-xs text-gray-500">ETA</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transform transition-transform ${expandedTrackingId === item.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.status === 'Delivered' ? 'bg-green-500' : 
                            item.status === 'Out for Delivery' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Expanded tracking details */}
                    {expandedTrackingId === item.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Tracking History</h4>
                        <div className="space-y-4">
                          {item.events.map((event, index) => (
                            <div key={index} className="flex">
                              <div className="flex flex-col items-center mr-4">
                                <div className={`rounded-full h-3 w-3 ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                {index < item.events.length - 1 && (
                                  <div className="h-full w-0.5 bg-gray-300"></div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-900">{event.status}</span>
                                  <span className="ml-2 text-xs text-gray-500">{event.time}</span>
                                </div>
                                <p className="text-xs text-gray-500">{event.date}</p>
                                <p className="text-xs text-gray-500">{event.location}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-gray-500 font-medium">No tracking items</h3>
                <p className="text-sm text-gray-400">
                  You don't have any packages being tracked
                </p>
              </div>
            )
          ) : (
            // Regular Notifications Display
            filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b last:border-b-0 flex ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex-shrink-0 mr-3">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{notification.title}</h3>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                  </div>
                  <div className="flex-shrink-0 ml-3 flex flex-col space-y-2">
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 rounded-full hover:bg-gray-200"
                        title="Mark as read"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 rounded-full hover:bg-gray-200"
                      title="Remove"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-gray-500 font-medium">No notifications</h3>
                <p className="text-sm text-gray-400">
                  {filter !== 'all' ? 'Try changing your filter selection' : 'You\'re all caught up!'}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;