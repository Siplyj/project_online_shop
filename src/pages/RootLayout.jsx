import AmplifyForm from 'components/AmplifyForm';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import useAuth from 'hooks/useAuth';
import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { login, clearAuth, authStatus, user } = useAuth();

  // useEffect for login/logout
  useEffect(() => {
    if (authStatus === 'authenticated' && user) {
      login(user);
      setShowAuthModal(false);
    } else if (authStatus === 'unauthenticated') {
      clearAuth();
    }
  }, [authStatus, user]);

  // ESC-button handler
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

  const amplifyFormMemo = useMemo(
    () => <AmplifyForm onClose={() => setShowAuthModal(false)} />,
    []
  );

  return (
    <>
      <Header onLoginClick={() => setShowAuthModal(true)} />

      <div className="main_content">
        <Outlet context={{ onLoginClick: () => setShowAuthModal(true) }} />
      </div>

      <Footer />

      {showAuthModal && amplifyFormMemo}
    </>
  );
};

export default RootLayout;