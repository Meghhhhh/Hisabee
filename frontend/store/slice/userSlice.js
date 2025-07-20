import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user_id: null,
    name: null,
    email: null,
    payment_refrence: null,
    phone_number: null,
    avatar: './avatar.png',
    friends: [],
    hisabs: [],
  },
  reducers: {
    setUserData: (state, action) => {
      const {
        user_id,
        name,
        email,
        payment_refrence,
        phone_number,
        friends = [],
        hisabs = [],
      } = action.payload;
      state.user_id = user_id;
      state.name = name;
      state.email = email;
      state.payment_refrence = payment_refrence;
      state.phone_number = phone_number;
      state.friends = friends;
      state.hisabs = hisabs;
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
