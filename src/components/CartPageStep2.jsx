import { useSelector } from 'react-redux';
import classes from '../pages/CartPage.module.css';

function CartPageStep2({ formData, setFormData }) {
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <li className={classes.cart_step2_form}>
      <form className={classes.cart_form}>
        <label>
          Full Name:
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </label>

        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          Address:
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </label>

        <label>
          City:
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </label>

        <label>
          ZIP code:
          <input type="text" name="zip" value={formData.zip} onChange={handleChange} required />
        </label>
      </form>

      <div className={classes.cart_total_text}>
        <span>Total:</span>
        <span>{totalAmount.toFixed(2)} €</span>
      </div>
    </li>
  );
}

export default CartPageStep2;