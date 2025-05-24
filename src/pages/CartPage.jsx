import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import classes from './CartPage.module.css';
import CartPageStep1 from '../components/CartPageStep1';
import CartPageStep2 from '../components/CartPageStep2';
import CheckoutButton from '../components/CheckoutButton';

function CartPage() {
  const items = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const [currentStep, setCurrentStep] = useState(1);
  const [tempQuantity, setTempQuantity] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  });

  useEffect(() => {
    const initialQuantities = {};
    items.forEach((item) => {
      initialQuantities[`${item.id}_${item.size}`] = item.quantity;
    });
    setTempQuantity(initialQuantities);
  }, [items]);

  if (items.length === 0) {
    return (
      <h1 className={classes.cart_title}>Oops! Your shopping cart is empty</h1>
    );
  }

  const isFormValid = (formData) => {
    return Object.values(formData).every((value) => value.trim() !== '');
  };

  return (
    <div className={classes.cart_wrapper}>
      <h1 className={classes.cart_title}>
        {currentStep === 1 && 'Shopping cart'}
        {currentStep === 2 && 'Delivery details'}
      </h1>

      <div className={classes.cart_list_wrapper}>
        <ul className={classes.cart_list}>
          {currentStep === 1 && (
            <CartPageStep1
              items={items}
              totalAmount={totalAmount}
              tempQuantity={tempQuantity}
              setTempQuantity={setTempQuantity}
              goToNextStep={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <>
              <CartPageStep2 formData={formData} setFormData={setFormData} />

              <li>
                <div className={classes.cart_prev_step_wrapper}>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className={classes.cart_prev_step_button}
                  >
                    Prev step
                  </button>
                </div>
              </li>
            </>
          )}
        </ul>

        <div className={classes.cart_total_wrapper}>
          <div className={classes.cart_total_text}>
            <span>Total:</span>
            <span>{totalAmount.toFixed(2)} €</span>
          </div>

          {currentStep === 1 && (
            <button
              className={classes.cart_order_button}
              onClick={() => setCurrentStep(2)}
            >
              Next step
            </button>
          )}

          {currentStep === 2 && (
            <CheckoutButton
              cartItems={items}
              formData={formData}
              disabled={!isFormValid(formData)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
