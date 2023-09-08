import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    currentPath: '/'
  },
  reducers: {
    setCurrentPath(state, action) {
      state.currentPath = action.payload;
    }
  }
});

export const navigationReducer = navigationSlice.reducer;
export const {
  setCurrentPath
} = navigationSlice.actions;
