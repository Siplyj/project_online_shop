import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuthenticator } from '@aws-amplify/ui-react';

import classes from './FavoritesPage.module.css';
import { setFavorites, removeFavorite } from '../store/favoritesSlice';
import { addItem, increaseQuantity, decreaseQuantity } from '../store/cartSlice';
import { removeFavoriteItem } from '../utils/RemoveFavoriteToggle';

import { BACKEND_URL } from '../../config';

function FavoritesPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items);
  const cartItems = useSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/favorites/${user.userId}`);
        const data = await res.json();
        dispatch(setFavorites(data));
      } catch (err) {
        console.error('Error loading favorites', err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user, dispatch]);

  if (loading) {
    return <div className={classes.favorites_title}>Loading favorites...</div>;
  }

  if (!favoriteItems || favoriteItems.length === 0) {
    return <div className={classes.favorites_title}>You have no favorites yet.</div>;
  }

  return (
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
                    src={item.image}
                    alt={item.name}
                    className={classes.favorite_image}
                  />
                </Link>
                <button
                  className={classes.favorite_icon}
                  onClick={() =>
                    removeFavoriteItem({
                      dispatch,
                      userId: user.userId,
                      product: item,
                      size: item.size,
                    })
                  }
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

              <Link
                to={`/${item.gender}/${item.url}`}
                className={classes.favorite_link}
              >
                <h2>{item.name}</h2>
              </Link>
              <p>Size: {item.size}</p>
              <p>{item.price} €</p>

              <div className={classes.actions_row}>
                {!cartItem ? (
                  <button
                    className={classes.product_cart_button}
                    onClick={() =>
                      dispatch(
                        addItem({
                          id: item.id,
                          gender: item.gender,
                          url: item.url,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          size: item.size,
                        })
                      )
                    }
                  >
                    Add to cart
                  </button>
                ) : (
                  <div className={classes.product_cart_controls}>
                    <button
                      className={classes.product_cart_control_button}
                      onClick={() =>
                        dispatch(
                          decreaseQuantity({ id: item.id, size: item.size })
                        )
                      }
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>

                    <Link to="/cart" className={classes.product_cart_item_info}>
                      In cart: {cartItem.quantity}{' '}
                      {cartItem.quantity > 1 ? 'items' : 'item'}
                    </Link>

                    <button
                      className={classes.product_cart_control_button}
                      onClick={() =>
                        dispatch(
                          increaseQuantity({ id: item.id, size: item.size })
                        )
                      }
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