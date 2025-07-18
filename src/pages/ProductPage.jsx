import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import classes from './ProductPage.module.css';
import { addItem, increaseQuantity, decreaseQuantity } from '../store/cartSlice';
import { addFavorite, removeFavorite, setFavorites } from '../store/favoritesSlice';
import ProductsSlider from '../components/ProductsSlider';

import { useAuthenticator } from '@aws-amplify/ui-react';

import { BACKEND_URL } from '../../config';

function ProductPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const { category, product_url } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [imageNumber, setImageNumber] = useState('01');
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const [favoriteForSelectedSize, setFavoriteForSelectedSize] = useState(false);
  const favoritesItems = useSelector((state) => state.favorites.items);
  const isFavorite = product && selectedSize
  ? favoritesItems.some(
      (item) => item.id === product.id && item.size === selectedSize
    )
  : false;

  // Loading product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/files/products.json`);
        if (!response.ok) {
          throw new Error('File upload error');
        }

        const data = await response.json();

        const foundProduct = data.find((item) => item.url === product_url);
        setProduct(foundProduct);

        if (foundProduct && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [category, product_url]);

  // Getting user's favorites list
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${BACKEND_URL}/favorites/${user.userId}`);
        const data = await res.json();
        dispatch(setFavorites(data));
      } catch (err) {
        console.error('Error loading favorites', err);
      }
    };

    loadFavorites();
  }, [user]);

  // Getting the available sizes and selecting the first one by default
  useEffect(() => {
    if (!product || !selectedSize) {
      setFavoriteForSelectedSize(false);
      return;
    }
    const exists = favoritesItems.some(
      (item) => item.id === product.id && item.size === selectedSize
    );
    setFavoriteForSelectedSize(exists);
  }, [favoritesItems, product, selectedSize]);

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  const handlePrevSlide = () => {
    setImageNumber((prev) => {
      let num = parseInt(prev, 10);
      num = num - 1;
      if (num < 1) {
        num = product.number_of_images;
      }
      return num.toString().padStart(2, '0');
    });
  };

  const handleNextSlide = () => {
    setImageNumber((prev) => {
      let num = parseInt(prev, 10);
      num = num + 1;
      if (num > product.number_of_images) {
        num = 1;
      }
      return num.toString().padStart(2, '0');
    });
  };

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: product.id,
        gender: product.gender,
        url: product.url,
        name: product.name,
        price: product.price,
        image: `/files/catalog/${category}/${product.id.slice(-2)}_${product.url}/01.webp`,
        size: selectedSize,
      })
    );
  };

  const handleFavoriteToggle = async () => {
    if (!user) return;

    const userId = user.userId;
    const productKey = `${product.id}_${selectedSize}`;

    if (isFavorite) {
      // Remove from favorites
      dispatch(removeFavorite({ id: product.id, size: selectedSize }));
      try {
        await fetch(`${BACKEND_URL}/favorites/remove`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            productId: productKey,
          }),
        });
      } catch (err) {
        console.error('Error while deleting from favorites', err);
      }
    } else {
      // Add to favorites

      dispatch(
        addFavorite({
          id: product.id,
          size: selectedSize,
          name: product.name,
          url: product.url,
          gender: product.gender,
          image: `/files/catalog/${category}/${product.id.slice(-2)}_${product.url}/01.webp`,
          price: product.price,
        })
      );

      try {
        await fetch(`${BACKEND_URL}/favorites/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            product: {
              id: product.id,
              size: selectedSize,
              name: product.name,
              url: product.url,
              gender: product.gender,
              image: `/files/catalog/${category}/${product.id.slice(-2)}_${product.url}/01.webp`,
              price: product.price,
            },
          }),
        });
      } catch (err) {
        console.error('Error when adding to favorites:', err);
      }
    }
  };

  const cartItem = cartItems.find(
    (item) => item.id === product.id && item.size === selectedSize
  );

  return (
    <>
      <div className={classes.product_wrapper}>
        <div className={classes.product_slider}>
          <div className={classes.product_slider_big_image}>
            <button
              onClick={handlePrevSlide}
              className={classes.product_slider_next_slide}
            >
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>

            <img
              src={`../files/catalog/${category}/${product.id.slice(-2)}_${product.url}/${imageNumber}.webp`}
              alt={product.name}
              className={classes.product_big_image}
            />

            <button
              onClick={handleNextSlide}
              className={classes.product_slider_prev_slide}
            >
              <span className="material-symbols-outlined">
                arrow_forward_ios
              </span>
            </button>
          </div>

          <div className={classes.product_slider_small_images}>
            {Array.from({ length: product.number_of_images }, (elem, index) => {
              const imgNumber = (index + 1).toString().padStart(2, '0');
              return (
                <div
                  key={imgNumber}
                  className={classes.product_small_image_wrapper}
                >
                  <img
                    src={`../files/catalog/${category}/${product.id.slice(-2)}_${product.url}/${imgNumber}.webp`}
                    alt={`${product.name} ${imgNumber}`}
                    className={`${classes.product_small_image} ${imgNumber === imageNumber ? classes.product_small_image_selected : ''}`}
                    onClick={() => setImageNumber(imgNumber)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className={classes.product_data}>
          <h1 className={classes.product_name}>{product.name}</h1>

          <span className={classes.product_price}>{product.price} €</span>

          {product.price_before_discount && (
            <span className={classes.price_before_discount}>
              {product.price_before_discount} €
            </span>
          )}

          <p className={classes.product_sizes_title}>Sizes</p>
          <div className={classes.product_sizes}>
            {product.sizes.map((size) => (
              <span
                key={size}
                className={
                  size === selectedSize
                    ? classes.product_selected_size
                    : classes.product_size
                }
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </span>
            ))}
          </div>

          <div className={classes.actions_row}>
            {!cartItem ? (
              <button
                className={classes.product_cart_button}
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            ) : (
              <div className={classes.product_cart_controls}>
                <button
                  className={classes.product_cart_control_button}
                  onClick={() =>
                    dispatch(
                      decreaseQuantity({ id: product.id, size: selectedSize })
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
                      increaseQuantity({ id: product.id, size: selectedSize })
                    )
                  }
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            )}

            {user && (
              <button
                onClick={handleFavoriteToggle}
                className={classes.favorite_cart_button}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: `'FILL' ${favoriteForSelectedSize ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`
                  }}
                >
                  favorite
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      <ProductsSlider title="New arrivals" gender={product.gender} />
    </>
  );
}

export default ProductPage;