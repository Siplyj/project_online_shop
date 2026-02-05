import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setLoginStatus, setUser, setUserId } from 'store/authSlice';
import { setFavorites } from 'store/favoritesSlice';
import { fetchFavorites } from 'utils/favorites/fetchFavorites';

export function useAuthInit() {
  const dispatch = useDispatch();
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    if (!user?.userId) return;

    dispatch(setUser(user));
    dispatch(setUserId(user.userId));
    dispatch(setLoginStatus(true));

    fetchFavorites(user.userId, dispatch, setFavorites);
  }, [user, dispatch]);
}