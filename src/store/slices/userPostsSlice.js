import { createSlice } from '@reduxjs/toolkit';

const userPostsSlice = createSlice({
  name: 'userPosts',
  initialState: {
    userPosts: {
      ownPosts: [],
      userPosts: [],
      subscriptions: [],
      marked: []
    },
    subscribers: 0,
    subscriptions: 0,
    reactions: 0,
    addEditPostMode: 0,
    editablePostData: null,
    postContent: '',
    sortOrder: 0,
    sortCriteria: null
  },
  reducers: {
    setUserPosts(state, action) {
      state.userPosts[action.payload.arrayName] = [...action.payload.postsData];
      state.addEditPostMode = 0;
      state.reactions = action.payload.postsData.reduce((accumulator, value) => accumulator += value.reactions.length, 0);

      state.subscribers = action.payload.userData.subscribers;
      state.subscriptions = action.payload.userData.subscriptions;
    },

    toggleReactionToUserPost(state, action) {
      state.userPosts[action.payload.arrayName] = [...state.userPosts[action.payload.arrayName].map((post) => {
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
    toggleUserPostMark(state, action) {
      state.userPosts[action.payload.arrayName] = [...state.userPosts[action.payload.arrayName].map((post) => {
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

    addPost(state, action) {
      state.userPosts.ownPosts.push(action.payload);
      state.addEditPostMode = 0;
      state.postContent = '';
    },
    updatePost(state, action) {
      state.userPosts.ownPosts = [...state.userPosts.ownPosts.map((post) => {
        if (post.id === state.editablePostData.id) return { ...post, ...action.payload };

        return post;
      })];
      state.addEditPostMode = 0;
      state.postContent = '';
    },
    deletePost(state, action) {
      state.userPosts.ownPosts = [...state.userPosts.ownPosts.filter((post) => (
        post.id !== action.payload.id
      ))];
    },

    setAddEditPostMode(state, action) {
      state.addEditPostMode = action.payload.addEditPostMode;
      if (action.payload.editablePostData) {
        state.editablePostData = action.payload.editablePostData;
        state.postContent = action.payload.editablePostData.content;
      } else {
        state.editablePostData = null;
      }
    },
    setPostContent(state, action) {
      state.postContent = action.payload
    },
    setSort(state, action) {
      state.sortCriteria = action.payload.criteria;
      state.sortOrder = action.payload.order;
    }
  }
});

export const userPostsReducer = userPostsSlice.reducer;
export const {
  setUserPosts,
  toggleReactionToUserPost,
  toggleUserPostMark,
  addPost,
  updatePost,
  deletePost,
  setAddEditPostMode,
  setPostContent,
  setSort
} = userPostsSlice.actions;
