import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import classes from 'pages/CartPage.module.css';
import { asset } from 'utils/assets';
import {
  removeItem,
  removeAllItems,
  increaseQuantity,
  decreaseQuantity,
  setItemQuantity,
} from '../store/cartSlice';

function CartPageStep1({ items, totalAmount, tempQuantity, setTempQuantity }) {
  const dispatch = useDispatch();
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      setConfirmAction({ type: 'removeItem', payload: item });
      setShowConfirmModal(true);
    } else {
      dispatch(decreaseQuantity({ id: item.id, size: item.size }));
    }
  };

  const handleDeleteAll = () => {
    setConfirmAction({ type: 'clearCart' });
    setShowConfirmModal(true);
  };

  const handleChange = (e, item) => {
    const value = e.target.value;
    setTempQuantity((prev) => ({
      ...prev,
      [`${item.id}_${item.size}`]: value,
    }));
  };

  const handleBlur = (item) => {
    const newQuantity = parseInt(tempQuantity[`${item.id}_${item.size}`], 10);

    if (!isNaN(newQuantity) && newQuantity > 0) {
      dispatch(
        setItemQuantity({ id: item.id, size: item.size, quantity: newQuantity })
      );
    } else {
      setTempQuantity((prev) => ({
        ...prev,
        [`${item.id}_${item.size}`]: item.quantity,
      }));
    }
  };
  console.log(items);

  return (
    <>
      {items.map((item) => (
        <li key={`${item.id}_${item.size}`} className={classes.cart_list_item}>
          <Link to={`/${item.gender}/${item.url}`}>
            <img
              src={asset(`/files/catalog/${item.gender}/${item.id.slice(-2)}_${item.url}/01.webp`)}
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
            <div className={classes.cart_list_item_price}>
              Price: {item.price} €
            </div>
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
                value={tempQuantity[`${item.id}_${item.size}`] ?? ''}
                onChange={(e) => handleChange(e, item)}
                onBlur={() => handleBlur(item)}
              />
              <button
                className={classes.cart_list_item_control_button}
                onClick={() =>
                  dispatch(increaseQuantity({ id: item.id, size: item.size }))
                }
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
            onClick={() =>
              dispatch(removeItem({ id: item.id, size: item.size }))
            }
          >
            ×
          </button>
        </li>
      ))}
      <li>
        <div className={classes.cart_delete_all_wrapper}>
          <button
            onClick={() => handleDeleteAll()}
            className={classes.cart_delete_all_button}
          >
            Clear shopping cart
          </button>
        </div>
      </li>

      {showConfirmModal && (
        <div className={classes.cart_modal_overlay}>
          <div className={classes.cart_modal_content}>
            <p>
              {confirmAction?.type === 'removeItem' ? (
                <>
                  Are you sure you want to remove
                  <br />"{confirmAction.payload.name}"<br />
                  from the cart?
                </>
              ) : (
                'Are you sure you want to clear the entire cart?'
              )}
            </p>
            <div className={classes.cart_modal_buttons}>
              <button
                onClick={() => {
                  if (confirmAction?.type === 'removeItem') {
                    dispatch(
                      removeItem({
                        id: confirmAction.payload.id,
                        size: confirmAction.payload.size,
                      })
                    );
                  } else if (confirmAction?.type === 'clearCart') {
                    dispatch(removeAllItems());
                  }
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                className={classes.cart_modal_confirm_button}
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                className={classes.cart_modal_cancel_button}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CartPageStep1;
