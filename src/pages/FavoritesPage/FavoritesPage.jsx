import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';

import { asset } from 'utils/assets';
import { handleAddToCart, handleDecreaseQuantity, handleIncreaseQuantity } from 'utils/cart/CartActions';
import { removeFavoriteItem } from 'utils/favorites/RemoveFavoriteToggle';
import classes from './FavoritesPage.module.css';

function FavoritesPage() {
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items || []);
  const cartItems = useSelector((state) => state.cart.items || []);
  const userId = useSelector((state) => state.auth.userId);

  const handleRemoveFavorite = useCallback(
    (item) => removeFavoriteItem({ dispatch, userId, product: item, size: item.size }),
    [dispatch, userId]
  );

  const handleAdd = useCallback((item) => handleAddToCart(dispatch, item), [dispatch]);
  const handleIncrease = useCallback((item) => handleIncreaseQuantity(dispatch, item), [dispatch]);
  const handleDecrease = useCallback((item) => handleDecreaseQuantity(dispatch, item), [dispatch]);

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return favoriteItems.length === 0 ? (
      <div className={classes.favorites_title}>You have no favorites yet.</div>
    ) : (
      <div className={classes.favorites_wrapper}>
      <h1 className={classes.favorites_title}>Your Favorites</h1>
      <div className={classes.favorites_grid}>
        {favoriteItems.map((item) => {
          const cartItem = cartItems.find(
            (cart) => cart.id === item.id && cart.size === item.size
          );

          return (
            <div key={`${item.id}_${item.size}`} className={classes.favorite_card}>
              <div className={classes.image_wrapper}>
                <Link
                  to={`/${item.gender}/${item.url}`}
                  className={classes.favorite_link}
                >
                  <img
                    src={asset(item.image)}
                    alt={item.name}
                    className={classes.favorite_image}
                  />
                </Link>
                <button
                  className={classes.favorite_icon}
                  onClick={() => handleRemoveFavorite(item)}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings: `'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
                      fontSize: '20px',
                      color: 'red'
                    }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              <Link to={`/${item.gender}/${item.url}`} className={classes.favorite_link}>
                <h2>{item.name}</h2>
              </Link>
              <p>Size: {item.size}</p>
              <p>{item.price} €</p>

              <div className={classes.actions_row}>
                {!cartItem ? (
                  <button
                    className={classes.product_cart_button}
                    onClick={() => handleAdd(item)}
                  >
                    Add to cart
                  </button>
                ) : (
                  <div className={classes.product_cart_controls}>
                    <button
                      className={classes.product_cart_control_button}
                      onClick={() => handleDecrease(item)}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>

                    <Link to="/cart" className={classes.product_cart_item_info}>
                      In cart: {cartItem.quantity}{' '}
                      {cartItem.quantity > 1 ? 'items' : 'item'}
                    </Link>

                    <button
                      className={classes.product_cart_control_button}
                      onClick={() => handleIncrease(item)}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FavoritesPage;