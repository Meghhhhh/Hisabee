import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Badge,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
  message: <MailIcon color="primary" />,
  alert: <WarningAmberIcon color="error" />,
  info: <InfoIcon color="secondary" />,
  success: <CheckCircleIcon color="success" />,
  default: <NotificationsIcon color="action" />,
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
      <Box p={4} textAlign="center">
        Loading notifications...
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} textAlign="center" color="error.main">
        {error}
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Notifications
          </Typography>
          <Badge badgeContent={unreadCount} color="primary">
            <NotificationsIcon />
          </Badge>
          <IconButton
            color="primary"
            onClick={() => setAddFriendOpen(true)}
            sx={{ ml: 2 }}
          >
            <PersonAddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Dialog open={addFriendOpen} onClose={() => setAddFriendOpen(false)}>
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Friend's Email"
            type="email"
            fullWidth
            value={friendEmail}
            onChange={e => setFriendEmail(e.target.value)}
            disabled={addFriendLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddFriendOpen(false)}
            disabled={addFriendLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddFriend}
            disabled={addFriendLoading || !friendEmail}
            variant="contained"
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ p: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          mb={2}
        >
          <Tabs
            value={filter}
            onChange={(_, v) => setFilter(v)}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 40 }}
          >
            {notificationTypes.map(type => (
              <Tab
                key={type.value}
                label={type.label}
                value={type.value}
                sx={{ minHeight: 40 }}
              />
            ))}
          </Tabs>

          <Stack direction="row" spacing={1}>
            <Button
              onClick={markAllAsRead}
              variant="outlined"
              size="small"
              disabled={unreadCount === 0}
              startIcon={<DoneIcon />}
            >
              Mark all read
            </Button>
            <Button
              onClick={clearAll}
              variant="outlined"
              size="small"
              color="error"
              disabled={notifications.length === 0}
              startIcon={<DeleteIcon />}
            >
              Clear all
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={2} divider={<Divider flexItem />}>
          {/* Incoming friend requests (pending) */}
          {filter === 'message' &&
            incomingRequests.length > 0 &&
            incomingRequests.map(req => (
              <Card key={req.user_id} variant="outlined">
                <CardContent
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <MailIcon color="primary" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {req.name || req.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {req.email}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      mr: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="info.main"
                      sx={{ mb: 0.5 }}
                    >
                      Incoming
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {req.status}
                    </Typography>
                  </Box>
                  {req.status === 'pending' && (
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        color="success"
                        variant="contained"
                        onClick={() => handleAccept(req.user_id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleReject(req.user_id)}
                      >
                        Reject
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            ))}
          {/* Outgoing friend requests (already present) */}
          {filter === 'message' &&
            friendRequests.length > 0 &&
            friendRequests.map(req => (
              <Card key={req.user_id} variant="outlined">
                <CardContent
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <MailIcon color="primary" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {req.name || req.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {req.email}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="warning.main"
                      sx={{ mb: 0.5 }}
                    >
                      Outgoing
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {req.status}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <Card
                key={notification.id}
                variant={notification.read ? 'outlined' : 'elevation'}
                sx={{
                  bgcolor: notification.read ? 'grey.100' : 'background.paper',
                  boxShadow: notification.read ? 0 : 2,
                }}
              >
                <CardContent
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  {iconMap[notification.type] || iconMap.default}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="text.primary"
                    >
                      {notification.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {notification.content}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {notification.time}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {!notification.read && (
                      <Button
                        onClick={() => markAsRead(notification.id)}
                        size="small"
                        color="primary"
                        variant="text"
                      >
                        Mark read
                      </Button>
                    )}
                    <IconButton
                      onClick={() => deleteNotification(notification.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))
          ) : filter === 'message' ? (
            friendRequests.length === 0 && incomingRequests.length === 0 ? (
              <Box p={4} textAlign="center" color="text.secondary">
                No friend requests to display.
              </Box>
            ) : null
          ) : filteredNotifications.length === 0 ? (
            <Box p={4} textAlign="center" color="text.secondary">
              No notifications to display.
            </Box>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
};

export default Notifications;
