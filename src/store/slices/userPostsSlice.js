import { createSlice } from '@reduxjs/toolkit';

const userPostsSlice = createSlice({
  name: 'userPosts',
  initialState: {
    userPosts: [],
    reactions: 0,
    addEditPostMode: 0,
    editablePostData: null,
    sortOrder: 0,
    sortCriteria: null
  },
  reducers: {
    setUserPosts(state, action) {
      state.userPosts = [...action.payload];
      state.addEditPostMode = 0;
      state.reactions = action.payload.reduce((accumulator, value) => accumulator += value.reactions.length, 0);
    },
    setAddEditPostMode(state, action) {
      state.addEditPostMode = action.payload.addEditPostMode;
      if (action.payload.editablePostData) {
        state.editablePostData = action.payload.editablePostData;
      } else {
        state.editablePostData = null;
      }
    },
    setSort(state, action) {
      state.sortCriteria = action.payload.criteria;
      state.sortOrder = action.payload.order;
    }
  }
});

export const userPostsReducer = userPostsSlice.reducer;
export const { setUserPosts, setAddEditPostMode, setSort } = userPostsSlice.actions;
