import { BACKEND_URL } from '../../config';
import { addFavorite } from '../store/favoritesSlice';

export async function addFavoriteItem({ dispatch, userId, product, selectedSize, category }) {
  const favoriteProduct = {
    id: product.id,
    size: selectedSize,
    name: product.name,
    url: product.url,
    gender: product.gender,
    image: `/files/catalog/${category}/${product.id.slice(-2)}_${product.url}/01.webp`,
    price: product.price,
  };

  dispatch(addFavorite(favoriteProduct));

  try {
    await fetch(`${BACKEND_URL}/favorites/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        product: favoriteProduct,
      }),
    });
  } catch (err) {
    console.error('Error when adding to favorites:', err);
  }
}