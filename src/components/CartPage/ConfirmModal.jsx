import classes from 'pages/CartPage/CartPage.module.css';
import ReactDOM from 'react-dom';

function ConfirmModal({ message, onConfirm, onCancel }) {
  return ReactDOM.createPortal(
    <div className={classes.cart_modal_overlay}>
      <div className={classes.cart_modal_content}>
        <p>{message}</p>
        <div className={classes.cart_modal_buttons}>
          <button onClick={onConfirm} className={classes.cart_modal_confirm_button}>Confirm</button>
          <button onClick={onCancel} className={classes.cart_modal_cancel_button}>Cancel</button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

export default ConfirmModal;