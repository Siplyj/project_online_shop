import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import classes from './FavoritesPage.module.css';
import { removeFavorite } from '../store/favoritesSlice';
import { addItem, increaseQuantity, decreaseQuantity } from '../store/cartSlice';
import { removeFavoriteItem } from '../utils/RemoveFavoriteToggle';

function FavoritesPage() {
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items);
  const cartItems = useSelector((state) => state.cart.items);
  const userId = useSelector((state) => state.auth.userId);

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
                    removeFavoriteItem({ dispatch, userId, product: item, size: item.size })
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

              <Link to={`/${item.gender}/${item.url}`} className={classes.favorite_link}>
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
                        dispatch(decreaseQuantity({ id: item.id, size: item.size }))
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
                        dispatch(increaseQuantity({ id: item.id, size: item.size }))
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