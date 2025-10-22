import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeAllItems } from 'store/cartSlice';

function SuccessPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(removeAllItems());
  }, [dispatch]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Payment was successful!</h1>
      <p>Thank you for your order.</p>
    </div>
  );
}

export default SuccessPage;