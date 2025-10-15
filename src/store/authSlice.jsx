import { createSlice } from '@reduxjs/toolkit';
import { setFavorites } from './favoritesSlice';

const initialState = {
  isLoggedIn: false,
  user: null,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginStatus(state, action) {
      state.isLoggedIn = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    logoutAction(state, action) {
      state.isLoggedIn = false;
      state.user = null;
      state.userId = null;

      if (action.payload?.dispatch) {
        action.payload.dispatch(setFavorites([]));
      }
    },
  },
});

export const { setLoginStatus, setUser, setUserId, logoutAction } = authSlice.actions;
export default authSlice.reducer;