import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import classes from '../pages/CartPage.module.css';

function CheckoutButton({ cartItems, formData, disabled, setWasSubmitted }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const [showError, setShowError] = useState(false);

  if (!user) {
    return (
      <button className={classes.cart_order_button} disabled>
        Please log in to order
      </button>
    );
  }

  const userId = user.userId;

  const handleCheckout = async () => {
    setWasSubmitted(true);

    if (disabled) {
      setShowError(true);
      return;
    }

    try {
      // Get orderId from the server
      const idResponse = await fetch(
        'http://localhost:4242/generate-order-id',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        }
      );

      const idData = await idResponse.json();
      const orderId = idData.orderId;

      if (!orderId) {
        console.error('Failed to generate orderId');
        return;
      }

      // Create a Stripe session by passing the orderId
      const response = await fetch(
        'http://localhost:4242/create-checkout-session',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartItems, formData, userId, orderId }),
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create a payment session:', data);
      }
    } catch (error) {
      console.error('Error at checkout:', error);
    }
  
  };

  return (
    <>
      {showError && (
        <p className={classes.error}>
          Please fill in all fields correctly before proceeding.
        </p>
      )}
      <button
        className={classes.cart_order_button}
        onClick={handleCheckout}
        disabled={false}
      >
        Order and pay
      </button>
    </>
  );
}

export default CheckoutButton;
