import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setUserId, logoutAction } from '../store/authSlice';
import { fetchAuthSession } from 'aws-amplify/auth';

import AccountOrders from '../components/AccountOrders';


const AccountPage = () => {
  const dispatch = useDispatch();
  const { authStatus, signOut, user } = useAuthenticator((context) => [
    context.authStatus,
    context.signOut,
    context.user,
  ]);
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndStoreUserId = async () => {
      const session = await fetchAuthSession();
      const sub = session.tokens?.idToken?.payload?.sub;
      dispatch(setUserId(sub));
    };

    if (authStatus === 'authenticated') {
      fetchAndStoreUserId();
    }
  }, [authStatus, dispatch, user]);

  const handleLogout = () => {
    dispatch(logoutAction());
    signOut();
    navigate('/');
  };

  if (authStatus === 'configuring') {
    return <div>Loading...</div>;
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/" replace />;
  }

  return (
  <div>
      {userId ? <AccountOrders userId={userId} /> : <p>Loading orders...</p>}
  </div>
);
};

export default AccountPage;