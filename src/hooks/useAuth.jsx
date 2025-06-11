import { useDispatch } from 'react-redux';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { logoutAction, setLoginStatus, setUser, setUserId } from '../store/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { signOut, user, authStatus } = useAuthenticator((context) => [
    context.signOut,
    context.user,
    context.authStatus,
  ]);

  const login = (userData) => {
    dispatch(setLoginStatus(true));
    dispatch(setUser({ username: userData.username }));
    dispatch(setUserId(userData.userId));
  };

  const logout = () => {
    dispatch(logoutAction());
    signOut();
  };

  const clearAuth = () => {
    dispatch(setLoginStatus(false));
    dispatch(setUser(null));
    dispatch(setUserId(null));
  };

  return { login, logout, clearAuth, authStatus, user };
};

export default useAuth;