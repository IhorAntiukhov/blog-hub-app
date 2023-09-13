import { configureStore } from '@reduxjs/toolkit';
import { navigationReducer, setCurrentPath, setSignInOrSignUp, showNotification, hideNotification } from './slices/navigationSlice';

const store = configureStore({
  reducer: {
    navigationReducer
  }
});

export { store, setCurrentPath, setSignInOrSignUp, showNotification, hideNotification };
