import { configureStore } from '@reduxjs/toolkit';
import cartReducer from 'store/cartSlice';
import authReducer from 'store/authSlice';
import favoritesReducer from 'store/favoritesSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    favorites: favoritesReducer,
  },
});

export default store;