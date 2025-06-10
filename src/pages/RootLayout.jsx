import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoginStatus, setUser } from '../store/authSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import AmplifyForm from '../components/AmplifyForm';

const RootLayout = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const { user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (authStatus === 'authenticated' && user) {
        try {
          const attributes = await fetchUserAttributes();

          dispatch(setLoginStatus(true));
          dispatch(
            setUser({
              username: user.username,
              email: attributes?.email || '',
            })
          );
        
          setShowAuthModal(false);

          // navigate('/account');
        } catch (error) {
          console.error('Error when retrieving user attributes:', error);
        }
      }

      if (authStatus === 'unauthenticated') {
        dispatch(setLoginStatus(false));
        dispatch(setUser(null));
      }
    };

    fetchData();
  }, [authStatus, user, dispatch]);

  // Hide modal (ESC)
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setShowAuthModal(false);
      }
    };

    if (showAuthModal) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showAuthModal]);

  return (
    <>
      <Header onLoginClick={() => setShowAuthModal(true)} />

      <div className="main_content">
        <Outlet />
      </div>

      <Footer />

      {showAuthModal && <AmplifyForm />}
    </>
  );
};

export default RootLayout;
