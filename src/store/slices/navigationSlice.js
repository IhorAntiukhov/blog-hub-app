import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    currentPath: '/',
    signInOrSignUp: 'signIn',
    userData: null,
    notifications: [],
  },
  reducers: {
    setCurrentPath(state, action) {
      window.history.pushState({}, '', action.payload);
      state.currentPath = action.payload;
    },
    setSignInOrSignUp(state, action) {
      state.signInOrSignUp = action.payload;
    },
    openUserInfoPage(state, action) {
      window.history.pushState({}, '', '/user-info');
      state.currentPath = '/user-info';
      state.userData = action.payload;
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
  openUserInfoPage,
  showNotification,
  hideNotification
} = navigationSlice.actions;
