import { configureStore } from '@reduxjs/toolkit';
import { navigationReducer, setCurrentPath } from './slices/navigationSlice';

const store = configureStore({
  reducer: {
    navigationReducer
  }
});

export { store, setCurrentPath };
