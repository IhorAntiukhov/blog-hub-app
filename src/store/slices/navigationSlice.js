import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    currentPath: '/',
    signInOrSignUp: 'signIn'
  },
  reducers: {
    setCurrentPath(state, action) {
      state.currentPath = action.payload;
    },
    setSignInOrSignUp(state, action) {
      state.signInOrSignUp = action.payload;
    }
  }
});

export const navigationReducer = navigationSlice.reducer;
export const {
  setCurrentPath,
  setSignInOrSignUp
} = navigationSlice.actions;
