import { BACKEND_URL } from 'config';

export const fetchFavorites = async (userId, dispatch, setFavorites) => {
  try {
    const response = await fetch(`${BACKEND_URL}/favorites/${userId}`);
    if (!response.ok) throw new Error('Error loading favorites');

    const data = await response.json();
    dispatch(setFavorites(data));
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
};