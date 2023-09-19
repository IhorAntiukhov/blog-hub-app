import { configureStore } from '@reduxjs/toolkit';
import { navigationReducer, setCurrentPath, setSignInOrSignUp, showNotification, hideNotification } from './slices/navigationSlice';
import { postsReducer, setAllPosts, setAddEditPostMode, setSort } from './slices/postsSlice';

const store = configureStore({
  reducer: {
    navigationReducer,
    postsReducer
  }
});

export {
  store, setCurrentPath, setSignInOrSignUp, showNotification, hideNotification,
  setAllPosts, setAddEditPostMode, setSort
};
