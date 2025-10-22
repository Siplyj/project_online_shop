import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { setUser, setUserId, setLoginStatus } from 'store/authSlice';
import { setFavorites } from 'store/favoritesSlice';
import { fetchFavorites } from 'utils/fetchFavorites';

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