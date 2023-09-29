import { createSlice } from '@reduxjs/toolkit';

const allPostsSlice = createSlice({
  name: 'allPosts',
  initialState: {
    allPosts: [],
    searchTerm: '',
    filterByPopularity: 'Recent',
    filteringTopics: []
  },
  reducers: {
    setAllPosts(state, action) {
      state.allPosts = [...action.payload];
    },
    toggleReactionToPost(state, action) {
      state.allPosts = [...state.allPosts.map((post) => {
        if (post.id === action.payload.id) {
          if (action.payload.addReaction) {
            return { ...post, reactions: [...post.reactions, action.payload.uid] };
          } else {
            return { ...post, reactions: post.reactions.filter((uid) => uid !== action.payload.uid) };
          }
        }

        return post;
      })];
    },
    togglePostMark(state, action) {
      state.allPosts = [...state.allPosts.map((post) => {
        if (post.id === action.payload.id) {
          if (action.payload.markPost) {
            return { ...post, marked: [...post.marked, action.payload.uid] };
          } else {
            return { ...post, marked: post.marked.filter((uid) => uid !== action.payload.uid) };
          }
        }

        return post;
      })];
    },

    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
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
  toggleReactionToPost,
  togglePostMark,
  setSearchTerm,
  setFilterByPopularity,
  addFilteringTopic,
  removeFilteringTopic
} = allPostsSlice.actions;