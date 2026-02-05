import { addItem, decreaseQuantity, increaseQuantity } from 'store/cartSlice';

export const handleAddToCart = (dispatch, item) => {
  dispatch(
    addItem({
      id: item.id,
      gender: item.gender,
      url: item.url,
      name: item.name,
      price: item.price,
      image: item.image,
      size: item.size,
    })
  );
};

export const handleIncreaseQuantity = (dispatch, item) => {
  dispatch(increaseQuantity({ id: item.id, size: item.size }));
};

export const handleDecreaseQuantity = (dispatch, item) => {
  dispatch(decreaseQuantity({ id: item.id, size: item.size }));
};

export const decreaseQuantityWithConfirm = ({dispatch, item, showConfirmModalFn}) => {
  if (item.quantity === 1) {
    showConfirmModalFn(item);
  } else {
    dispatch(decreaseQuantity({ id: item.id, size: item.size }));
  }
};

export const removeItemWithConfirm = ({ item, showConfirmModalFn }) => {
  showConfirmModalFn(item);
};