import { createSlice } from '@reduxjs/toolkit';

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
    logoutAction(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.userId = null;
    },
  },
});

export const { setLoginStatus, setUser, setUserId, logoutAction } = authSlice.actions;
export default authSlice.reducer;