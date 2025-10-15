import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.items = action.payload;
    },
    addFavorite: (state, action) => {
      const exists = state.items.find(
        item => item.id === action.payload.id && item.size === action.payload.size
      );
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter(
        item => !(item.id === action.payload.id && item.size === action.payload.size)
      );
    },
    toggleFavorite: (state, action) => {
      const exists = state.items.find(
        item => item.id === action.payload.id && item.size === action.payload.size
      );
      if (exists) {
        state.items = state.items.filter(
          item => !(item.id === action.payload.id && item.size === action.payload.size)
        );
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;

// Selector for the number of favorites
export const selectFavoriteCount = (state) => state.favorites.items.length;

export default favoritesSlice.reducer;