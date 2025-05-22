import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: null,
    email: null,
    payment_refrence: null,
    phone: null,
    avatar: 'https://pngtree.com/free-png-vectors/user-avatar',
    history: [],
    friends: [],
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
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
