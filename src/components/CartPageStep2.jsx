import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classes from 'pages/CartPage.module.css';

function CartPageStep2({ formData, setFormData, setIsFormValid, wasSubmitted }) {
  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!data.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!data.address.trim()) newErrors.address = 'Address is required';
    if (!data.city.trim()) newErrors.city = 'City is required';
    if (!data.zip.trim()) newErrors.zip = 'ZIP code is required';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const newErrors = validateForm(updatedForm);
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  useEffect(() => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  return (
    <li className={classes.cart_step2_form}>
      <form className={classes.cart_form} noValidate>
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          {wasSubmitted && errors.fullName && (
            <p className={classes.cart_form_input_error}>{errors.fullName}</p>
          )}
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {wasSubmitted && errors.email && (
            <p className={classes.cart_form_input_error}>{errors.email}</p>
          )}
        </label>

        <label>
          Phone number:
          <input
            type="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {wasSubmitted && errors.phone && (
            <p className={classes.cart_form_input_error}>{errors.phone}</p>
          )}
        </label>

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          {wasSubmitted && errors.address && (
            <p className={classes.cart_form_input_error}>{errors.address}</p>
          )}
        </label>

        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
          {wasSubmitted && errors.city && (
            <p className={classes.cart_form_input_error}>{errors.city}</p>
          )}
        </label>

        <label>
          ZIP code:
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            required
          />
          {wasSubmitted && errors.zip && (
            <p className={classes.cart_form_input_error}>{errors.zip}</p>
          )}
        </label>
      </form>
    </li>
  );
}

export default CartPageStep2;