import { configureStore } from '@reduxjs/toolkit';
import loadingSliceReducer from './slice/loading.js';
import loggedInSliceReducer from './slice/isLoggedIn.js';

export const store = configureStore({
  reducer: {
    loading: loadingSliceReducer,
    auth: loggedInSliceReducer,
  },
});
