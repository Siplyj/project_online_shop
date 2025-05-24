import { useSelector } from 'react-redux';

import classes from '../pages/CartPage.module.css';

function CheckoutButton({ cartItems, formData }) {
  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, formData }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating a payment session:', error);
    }
  };

  return <button className={classes.cart_order_button} onClick={handleCheckout}>Перейти к оплате</button>;
}

export default CheckoutButton;

