import { createSlice } from '@reduxjs/toolkit';

const loggedInSlice = createSlice({
  name: 'loggedIn',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setIsLoggedIn } = loggedInSlice.actions;
export default loggedInSlice.reducer;
