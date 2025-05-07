import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
};

const cartFromLocalStorage = localStorage.getItem('cart');
if (cartFromLocalStorage) {
  const parsedCart = JSON.parse(cartFromLocalStorage);
  initialState.items = parsedCart.items || [];
  initialState.totalAmount = parsedCart.totalAmount || 0;
  initialState.totalQuantity = parsedCart.totalQuantity || 0;
}

const calculateTotals = (state) => {
  state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
  state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem('cart', JSON.stringify(state));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id && item.size === newItem.size);

      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      } else {
        state.items.push({
          id: newItem.id,
          gender: newItem.gender,
          url: newItem.url,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          size: newItem.size,
          quantity: 1,
          totalPrice: newItem.price,
        });
      }

      calculateTotals(state);
    },

    removeItem(state, action) {
      const id = action.payload.id;
      const size = action.payload.size;

      state.items = state.items.filter((item) => !(item.id === id && item.size === size));
      calculateTotals(state);
    },

    increaseQuantity(state, action) {
      const { id, size } = action.payload;
      const existingItem = state.items.find((item) => item.id === id && item.size === size);

      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += existingItem.price;
      calculateTotals(state);
      }
    },

    decreaseQuantity(state, action) {
      const { id, size } = action.payload;
      const existingItem = state.items.find((item) => item.id === id && item.size === size);

      if (existingItem) {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;

        if (existingItem.quantity <= 0) {
          state.items = state.items.filter((item) => !(item.id === id && item.size === size));
        }

        calculateTotals(state);
      }
    },

    setItemQuantity(state, action) {
      const { id, size, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id && item.size === size);

      if (existingItem && quantity > 0) {
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
      } else if (existingItem && quantity <= 0) {
        state.items = state.items.filter((item) => !(item.id === id && item.size === size));
      }

      calculateTotals(state);
    }
  },
});

export const { addItem, removeItem, increaseQuantity, decreaseQuantity } = cartSlice.actions;

export default cartSlice.reducer;