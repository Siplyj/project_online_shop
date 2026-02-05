import ConfirmModal from 'components/CartPage/ConfirmModal.jsx';
import classes from 'pages/CartPage/CartPage.module.css';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem, setItemQuantity } from 'store/cartSlice';
import { asset } from 'utils/assets';
import { decreaseQuantityWithConfirm, handleIncreaseQuantity, removeItemWithConfirm } from 'utils/cart/CartActions';

function CartPageStep1({ items, tempQuantity, setTempQuantity }) {
  const dispatch = useDispatch();
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- Handlers start ---
  const handleDecreaseClick = useCallback((item) => {
    decreaseQuantityWithConfirm({
      dispatch,
      item,
      showConfirmModalFn: (itemToRemove) => {
        setConfirmAction({ type: 'removeItem', payload: itemToRemove });
        setShowConfirmModal(true);
      },
    });
  }, [dispatch]);

  const handleIncreaseClick = useCallback((item) => {
    handleIncreaseQuantity(dispatch, item);
  }, [dispatch]);

  const handleRemoveClick = useCallback((item) => {
    removeItemWithConfirm({
      item,
      showConfirmModalFn: (itemToRemove) => {
        setConfirmAction({ type: 'removeItem', payload: itemToRemove });
        setShowConfirmModal(true);
      },
    });
  }, []);

  const handleInputChange = useCallback((item, value) => {
    setTempQuantity((prev) => ({
      ...prev,
      [`${item.id}_${item.size}`]: value,
    }));
  }, [setTempQuantity]);

  const handleConfirm = useCallback(() => {
    if (confirmAction?.type === 'removeItem') {
      dispatch(removeItem({ id: confirmAction.payload.id, size: confirmAction.payload.size }));
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  }, [dispatch, confirmAction]);

  const handleCancel = useCallback(() => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  }, []);

  const handleInputBlur = useCallback((item) => {
    const newQuantity = parseInt(tempQuantity[`${item.id}_${item.size}`], 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      dispatch(setItemQuantity({ id: item.id, size: item.size, quantity: newQuantity }));
    } else {
      setTempQuantity((prev) => ({
        ...prev,
        [`${item.id}_${item.size}`]: item.quantity,
      }));
    }
  }, [dispatch, tempQuantity, setTempQuantity]);

  // --- Handlers end ---

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
            <div className={classes.cart_list_item_price}>Price: {item.price} €</div>

            <div className={classes.cart_list_item_controls}>
              <button
                className={classes.cart_list_item_control_button}
                onClick={() => handleDecreaseClick(item)}
              >
                <span className="material-symbols-outlined">remove</span>
              </button>

              <input
                className={classes.cart_list_item_quantity}
                type="number"
                min="1"
                value={tempQuantity[`${item.id}_${item.size}`] ?? item.quantity}
                onChange={(e) => handleInputChange(item, e.target.value)}
                onBlur={() => handleInputBlur(item)}
              />

              <button
                className={classes.cart_list_item_control_button}
                onClick={() => handleIncreaseClick(item)}
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
            onClick={() => handleRemoveClick(item)}
          >
            ×
          </button>
        </li>
      ))}

      {showConfirmModal && (
        <ConfirmModal
          message={
            confirmAction?.type === 'removeItem'
              ? `Are you sure you want to remove "${confirmAction.payload.name}" from the cart?`
              : 'Are you sure you want to clear the entire cart?'
          }
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

export default CartPageStep1;