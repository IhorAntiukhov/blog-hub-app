import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    currentPath: '/',
    signInOrSignUp: 'signIn',
    notifications: []
  },
  reducers: {
    setCurrentPath(state, action) {
      state.currentPath = action.payload;
    },
    setSignInOrSignUp(state, action) {
      state.signInOrSignUp = action.payload;
    },

    showNotification(state, action) {
      state.notifications.push(action.payload);
    },
    hideNotification(state, action) {
      state.notifications = state.notifications.filter((notification) => (
        notification.id !== action.payload
      ));
    }
  }
});

export const navigationReducer = navigationSlice.reducer;
export const {
  setCurrentPath,
  setSignInOrSignUp,
  showNotification,
  hideNotification
} = navigationSlice.actions;
