import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { setUser, setUserId, setLoginStatus } from './store/authSlice';
import { setFavorites } from './store/favoritesSlice';
import { BACKEND_URL } from '../config';

// Pages
import RootLayout from './pages/RootLayout';
import MainPage from './pages/MainPage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import AccountPage from './pages/AccountPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  const dispatch = useDispatch();
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    if (!user?.userId) return;

    // Setting up user and authorization in Redux
    dispatch(setUser(user));
    dispatch(setUserId(user.userId));
    dispatch(setLoginStatus(true));

    // Download favorites
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/favorites/${user.userId}`);
        if (!response.ok) throw new Error('Error loading favorites');

        const data = await response.json();
        dispatch(setFavorites(data));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    fetchFavorites();
  }, [user, dispatch]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <MainPage />,
        },
        {
          path: ':category',
          children: [
            {
              index: true,
              element: <CatalogPage />,
            },
            {
              path: ':product_url',
              element: <ProductPage />,
            },
          ],
        },
        {
          path: 'favorite',
          element: <FavoritesPage />,
        },
        {
          path: 'cart',
          element: <CartPage />,
        },
        {
          path: 'success',
          element: <SuccessPage />,
        },
        {
          path: 'cancel',
          element: <CancelPage />,
        },
        {
          path: 'account',
          element: <AccountPage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  });

  return <RouterProvider router={router} />;
}

export default App;
