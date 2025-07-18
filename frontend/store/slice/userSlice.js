import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: null,
    email: null,
    payment_refrence: null,
    phone: null,
    avatar: './avatar.png',
    history: [],
    friends: [],
    notifications: [],
    friendRequests: [],
  },
  reducers: {
    setUserData: (state, action) => {
      const {
        name,
        email,
        payment_refrence,
        phone,
        history = [],
        friends = [],
      } = action.payload;
      state.name = name;
      state.email = email;
      state.payment_refrence = payment_refrence;
      state.phone = phone;
      state.history = history;
      state.friends = friends;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setFriendRequests: (state, action) => {
      state.friendRequests = action.payload;
    },
  },
});

export const { setUserData, setNotifications, setFriendRequests } =
  userSlice.actions;
export default userSlice.reducer;
