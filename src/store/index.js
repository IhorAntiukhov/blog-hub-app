import { configureStore } from '@reduxjs/toolkit';
import {
  navigationReducer, setCurrentPath, setSignInOrSignUp, openUserInfoPage,
  addSubscriber, removeSubscriber, showNotification, hideNotification
} from './slices/navigationSlice';
import {
  userPostsReducer, setUserPosts, toggleReactionToUserPost, toggleUserPostMark,
  addPost, updatePost, deletePost, setAddEditPostMode, setPostContent, setSort
} from './slices/userPostsSlice';
import {
  allPostsReducer, setAllPosts, toggleReactionToPost, togglePostMark,
  setSearchTerm, setFilterByPopularity, addFilteringTopic, removeFilteringTopic
} from './slices/allPostsSlice';

const store = configureStore({
  reducer: {
    navigationReducer,
    userPostsReducer,
    allPostsReducer
  }
});

export {
  store, setCurrentPath, setSignInOrSignUp, openUserInfoPage, addSubscriber, removeSubscriber, showNotification, hideNotification,
  setUserPosts, toggleReactionToUserPost, toggleUserPostMark, addPost, updatePost, deletePost, setAddEditPostMode, setPostContent, setSort,
  setAllPosts, toggleReactionToPost, togglePostMark, setSearchTerm, setFilterByPopularity, addFilteringTopic, removeFilteringTopic
};
