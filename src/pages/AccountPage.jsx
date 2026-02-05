import { AccountSettings, useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { logoutAction, setUserId } from 'store/authSlice';

import AccountOrders from 'components/Account/AccountOrders';

const AccountPage = () => {
  const dispatch = useDispatch();
  const { authStatus, signOut, user } = useAuthenticator((context) => [
    context.authStatus,
    context.signOut,
    context.user,
    context.deleteUser,
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

  const handleSuccess = () => {
    alert('Your account has been successfully deleted')
  }


  if (authStatus === 'configuring') {
    return <div>Loading...</div>;
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/" replace />;
  }

  return (
  <div>
      {userId ? <AccountOrders userId={userId} /> : <p>Loading orders...</p>}
      <div style={{ maxWidth: '200px', margin: '20px auto' }}>
        <AccountSettings.DeleteUser onSuccess={handleSuccess} />
      </div>
  </div>
);
};

export default AccountPage;