import { createSlice } from '@reduxjs/toolkit';

const allPostsSlice = createSlice({
  name: 'allPosts',
  initialState: {
    allPosts: [],
    filterByPopularity: 'Recent',
    filteringTopics: []
  },
  reducers: {
    setAllPosts(state, action) {
      state.allPosts = [...action.payload];
    },

    setFilterByPopularity(state, action) {
      state.filterByPopularity = action.payload;
    },
    addFilteringTopic(state, action) {
      state.filteringTopics.push(action.payload);
    },
    removeFilteringTopic(state, action) {
      state.filteringTopics = [...state.filteringTopics.filter((topic) => topic !== action.payload)];
    }
  }
});

export const allPostsReducer = allPostsSlice.reducer;
export const {
  setAllPosts,
  setFilterByPopularity,
  addFilteringTopic,
  removeFilteringTopic
} = allPostsSlice.actions;