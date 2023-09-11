import { configureStore } from '@reduxjs/toolkit';
import { navigationReducer, setCurrentPath, setSignInOrSignUp } from './slices/navigationSlice';

const store = configureStore({
  reducer: {
    navigationReducer
  }
});

export { store, setCurrentPath, setSignInOrSignUp };
