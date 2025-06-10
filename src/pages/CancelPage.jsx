import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeAllItems } from '../store/cartSlice';

function CancelPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(removeAllItems());
  }, [dispatch]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>❌ Payment failed</h1>
      <p>You canceled your payment or there was an error.</p>
    </div>
  );
}

export default CancelPage;