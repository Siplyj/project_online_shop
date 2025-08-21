import { BACKEND_URL } from '../../config';
import { removeFavorite } from '../store/favoritesSlice';

export async function removeFavoriteItem({ dispatch, userId, product, size }) {
  const productKey = `${product.id}_${size}`;

  dispatch(removeFavorite({ id: product.id, size }));

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
}