import { configureStore } from '@reduxjs/toolkit';
import { navigationReducer, setCurrentPath, setSignInOrSignUp, showNotification, hideNotification } from './slices/navigationSlice';
import { userPostsReducer, setUserPosts, setAddEditPostMode, setSort } from './slices/userPostsSlice';
import { allPostsReducer, setAllPosts, setFilterByPopularity, addFilteringTopic, removeFilteringTopic } from './slices/allPostsSlice';

const store = configureStore({
  reducer: {
    navigationReducer,
    userPostsReducer,
    allPostsReducer
  }
});

export {
  store, setCurrentPath, setSignInOrSignUp, showNotification, hideNotification,
  setUserPosts, setAddEditPostMode, setSort,
  setAllPosts, setFilterByPopularity, addFilteringTopic, removeFilteringTopic
};
