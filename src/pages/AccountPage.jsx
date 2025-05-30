import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';

const AccountPage = () => {
  const { user, authStatus, signOut } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
    context.signOut,
  ]);

  const handleLogout = () => {
    signOut();
  };

  if (authStatus === 'configuring') {
    return <div>Loading...</div>;
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <button onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default AccountPage;