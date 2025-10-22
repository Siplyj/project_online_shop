import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classes from './AccountOrders.module.css';
import { asset } from 'utils/assets';
import { BACKEND_URL } from 'config';

const AccountOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/orders/${userId}`);

        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(data);
        if (data.length > 0) setExpandedOrderId(data[0].orderId);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  const toggleOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getOrderTotal = (order) => {
    if (order.amount) return (order.amount / 100).toFixed(2);
    if (!order.cartItems) return '0.00';
    const total = order.cartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    return total.toFixed(2);
  };

  const handleCheckout = async (order) => {
    try {
      const response = await fetch(`${BACKEND_URL}/create-checkout-session`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: order.cartItems,
          formData: {
            fullName: order.fullName,
            email: order.email,
            phone: order.phone,
            address: order.address,
            city: order.city,
            zip: order.zip,
          },
          userId: order.userId,
          orderId: order.orderId,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      console.error('AWS Error:', JSON.stringify(error, null, 2));
    }
  };

  return (
    <div className={classes.orders_wrapper}>
      <h2 className={classes.orders_wrapper_title}>My Orders</h2>

      {!orders.length && (
        <p className={classes.no_orders_description}>You don't have any orders yet.</p>
      )}

      {orders.map((order) => {
        const isExpanded = order.orderId === expandedOrderId;

        return (
          <div key={order.orderId} className={classes.order_card}>
            <div
              className={classes.order_header}
              onClick={() => toggleOrder(order.orderId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleOrder(order.orderId)}
            >
              <p>
                <strong>Order №: </strong>{order.orderId}
              </p>
              <p>
                <strong>Date: </strong>{new Date(order.createdAt).toLocaleString('en-GB')}
              </p>
              <p>
                <strong>Total: </strong>€{getOrderTotal(order)}
              </p>
              <p>
                <strong>Status: </strong>{order.status === 'paid' ? 'Paid' : order.status}
              </p>
            </div>

            {isExpanded && (
              <div className={classes.order_items}>
                <div className={classes.customer_info}>
                  <p>
                    <strong>Full Name:</strong> {order.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address}, {order.city}, {order.zip}
                  </p>
                </div>

                {order.cartItems?.map((item) => (
                  <div key={item.id} className={classes.order_item}>
                    <Link
                      to={`/${item.gender}/${item.url}`}
                      className={classes.order_item_image_wrapper}
                    >
                      <img
                        src={asset(item.image)}
                        alt={item.name}
                        className={classes.order_item_image}
                      />
                    </Link>

                    <Link
                      to={`/${item.gender}/${item.url}`}
                      className={classes.order_item_details}
                    >
                      <p className={classes.order_item_name}>{item.name}</p>
                      <p className={classes.order_item_info}>
                        Size: {item.size} | Quantity: {item.quantity}
                      </p>
                    </Link>

                    <div className={classes.order_item_price}>
                      €{item.totalPrice.toFixed(2)}
                    </div>
                  </div>
                ))}

                {order.status === 'Not paid' && (
                  <div className={classes.order_payment_wrapper}>
                    <button
                      className={classes.order_pay_button}
                      onClick={() => {handleCheckout(order)}}
                      >
                      Pay now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AccountOrders;
