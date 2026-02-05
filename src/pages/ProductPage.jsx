import { useAuthenticator } from '@aws-amplify/ui-react';
import ProductsSlider from 'components/MainPage/ProductsSlider';
import { BACKEND_URL } from 'config';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { setFavorites } from 'store/favoritesSlice';
import { asset } from 'utils/assets';
import { handleAddToCart, handleDecreaseQuantity, handleIncreaseQuantity } from 'utils/cart/CartActions';
import { addFavoriteItem } from 'utils/favorites/AddFavoriteToggle';
import { removeFavoriteItem } from 'utils/favorites/RemoveFavoriteToggle';
import classes from './ProductPage.module.css';

function ProductPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const { category, product_url } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [imageNumber, setImageNumber] = useState('01');
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const favoritesItems = useSelector((state) => state.favorites.items);

  const isFavorite = product && selectedSize
    ? favoritesItems.some(item => item.id === product.id && item.size === selectedSize)
    : false;

  const [favoriteForSelectedSize, setFavoriteForSelectedSize] = useState(false);

  // Loading product data
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(asset('files/products.json'));
        if (!response.ok) throw new Error('File upload error');

        const data = await response.json();
        const foundProduct = data.find(item => item.url === product_url);
        setProduct(foundProduct);
        if (foundProduct?.sizes?.length > 0) setSelectedSize(foundProduct.sizes[0]);
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
    const exists = favoritesItems.some(item => item.id === product.id && item.size === selectedSize);
    setFavoriteForSelectedSize(exists);
  }, [favoritesItems, product, selectedSize]);

  //--- Handlers start ---
  const handlePrevSlide = useCallback(() => {
    setImageNumber(prev => {
      let num = parseInt(prev, 10) - 1;
      if (num < 1) num = product.number_of_images;
      return num.toString().padStart(2, '0');
    });
  }, [product]);

  const handleNextSlide = useCallback(() => {
    setImageNumber(prev => {
      let num = parseInt(prev, 10) + 1;
      if (num > product.number_of_images) num = 1;
      return num.toString().padStart(2, '0');
    });
  }, [product]);

  const handleAdd = useCallback(() => {
    console.log(import.meta.env.BASE_URL)
    handleAddToCart(dispatch, {
      id: product.id,
      gender: product.gender,
      url: product.url,
      name: product.name,
      price: product.price,
      image: `files/catalog/${category}/${product.id.slice(-2)}_${product.url}/01.webp`,
      size: selectedSize,
    });
  }, [dispatch, product, category, selectedSize]);

  const handleIncrease = useCallback(() => {
    handleIncreaseQuantity(dispatch, { id: product.id, size: selectedSize });
  }, [dispatch, product, selectedSize]);

  const handleDecrease = useCallback(() => {
    handleDecreaseQuantity(dispatch, { id: product.id, size: selectedSize });
  }, [dispatch, product, selectedSize]);

  const handleFavoriteToggle = useCallback(() => {
    if (!user) return;
    const userId = user.userId;

    if (isFavorite) {
      removeFavoriteItem({ dispatch, userId, product, size: selectedSize });
    } else {
      addFavoriteItem({ dispatch, userId, product, selectedSize, category });
    }
  }, [dispatch, user, isFavorite, product, selectedSize, category]);

  //--- Handlers end ---

  const cartItem = cartItems.find(item => item.id === product?.id && item.size === selectedSize);

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;


  return (
    <>
      <div className={classes.product_wrapper}>
        <div className={classes.product_slider}>
          <div className={classes.product_slider_big_image}>
            <button onClick={handlePrevSlide} className={classes.product_slider_next_slide}>
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>

            <img
              src={`${import.meta.env.BASE_URL}files/catalog/${category}/${product.id.slice(-2)}_${product.url}/${imageNumber}.webp`}
              alt={product.name}
              className={classes.product_big_image}
            />

            <button onClick={handleNextSlide} className={classes.product_slider_prev_slide}>
              <span className="material-symbols-outlined">arrow_forward_ios</span>
            </button>
          </div>

          <div className={classes.product_slider_small_images}>
            {Array.from({ length: product.number_of_images }, (_, i) => (i + 1).toString().padStart(2, '0')).map(imgNumber => (
              <div key={imgNumber} className={classes.product_small_image_wrapper}>
                <img
                  src={`${import.meta.env.BASE_URL}files/catalog/${category}/${product.id.slice(-2)}_${product.url}/${imgNumber}.webp`}
                  alt={`${product.name} ${imgNumber}`}
                  className={`${classes.product_small_image} ${imgNumber === imageNumber ? classes.product_small_image_selected : ''}`}
                  onClick={() => setImageNumber(imgNumber)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={classes.product_data}>
          <h1 className={classes.product_name}>{product.name}</h1>
          <span className={classes.product_price}>{product.price} €</span>
          {product.price_before_discount && <span className={classes.price_before_discount}>{product.price_before_discount} €</span>}

          <p className={classes.product_sizes_title}>Sizes</p>
          <div className={classes.product_sizes}>
            {product.sizes.map(size => (
              <span
                key={size}
                className={size === selectedSize ? classes.product_selected_size : classes.product_size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </span>
            ))}
          </div>

          <div className={classes.actions_row}>
            {!cartItem ? (
              <button className={classes.product_cart_button} onClick={handleAdd}>Add to cart</button>
            ) : (
              <div className={classes.product_cart_controls}>
                <button className={classes.product_cart_control_button} onClick={handleDecrease}>
                  <span className="material-symbols-outlined">remove</span>
                </button>

                <Link to="/cart" className={classes.product_cart_item_info}>
                  In cart: {cartItem.quantity} {cartItem.quantity > 1 ? 'items' : 'item'}
                </Link>

                <button className={classes.product_cart_control_button} onClick={handleIncrease}>
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            )}

            {user && (
              <button onClick={handleFavoriteToggle} className={classes.favorite_cart_button}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: `'FILL' ${favoriteForSelectedSize ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
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