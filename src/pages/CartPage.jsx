import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import classes from './CartPage.module.css';
import { removeItem, increaseQuantity, decreaseQuantity } from '../store/cartSlice';

function CartPage() {
  const items = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  if (items.length === 0) {
    return <div>Cart is empty</div>;
  }

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      setItemToDelete(item); // Сохраняем товар, который хотим удалить
      setShowConfirmModal(true); // Показываем модалку
    } else {
      dispatch(decreaseQuantity({ id: item.id, size: item.size }));
    }
  };


  return (
    <div className={classes.cart_wrapper}>
      <h1 className={classes.cart_title}>Shopping cart</h1>

      <div className={classes.cart_list_wrapper}>

        <ul className={classes.cart_list}>
          {items.map((item) => (
            <li
              key={`${item.id}_${item.size}`}
              className={classes.cart_list_item}
            >
              <Link to={`/${item.gender}/${item.url}`}>
                <img
                  src={`/files/catalog/${item.gender}/${item.id.slice(-2)}_${item.url}/01.webp`}
                  alt={item.name}
                  className={classes.cart_list_item_image}
                />
              </Link>

              <div>
                <Link
                  to={`/${item.gender}/${item.url}`}
                  className={classes.cart_list_item_name_link}
                >
                  <h3 className={classes.cart_list_item_name}>{item.name}</h3>
                </Link>
                <div className={classes.cart_list_item_size}>Size: {item.size}</div>
                <div className={classes.cart_list_item_price}>Price: {item.price} €</div>
                <div className={classes.cart_list_item_controls}>
                  <button
                    className={classes.cart_list_item_control_button}
                    onClick={() => handleDecrease(item)}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>

                  <input
                    className={classes.cart_list_item_quantity}
                    type="text"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value, 10);
                      if (!isNaN(newQuantity)) {
                        dispatch(setItemQuantity({ id: item.id, size: item.size, quantity: newQuantity }));
                      }
                    }}
                  />
                  <button
                    className={classes.cart_list_item_control_button}
                    onClick={() => dispatch(increaseQuantity({ id: item.id, size: item.size }))}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <div className={classes.cart_list_item_total_price}>
                  {(item.price * item.quantity).toFixed(2)} €
                </div>
              </div>

              <button
                className={classes.cart_list_item_remove_button}
                onClick={() => dispatch(removeItem({ id: item.id, size: item.size }))}
              >
                ×
              </button>

            </li>
          ))}
        </ul>

        <div className={classes.cart_total_wrapper}>
          <div className={classes.cart_total_text}>
            <span>Total:</span>
            <span>{totalAmount.toFixed(2)} €</span>
          </div>
          <button className={classes.cart_order_button}>Order</button>
        </div>

      </div>

      {showConfirmModal && (
        <div className={classes.cart_modal_overlay}>
          <div className={classes.cart_modal_content}>
            <p>Are you sure you want to remove<br/>"{itemToDelete.name}"<br/>from the cart?`</p>
            <div className={classes.cart_modal_buttons}>
              <button
                onClick={() => {
                  dispatch(removeItem({ id: itemToDelete.id, size: itemToDelete.size }));
                  setShowConfirmModal(false);
                }}
                className={classes.cart_modal_confirm_button}
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className={classes.cart_modal_cancel_button}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CartPage;