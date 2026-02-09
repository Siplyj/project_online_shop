// import { createBrowserRouter } from 'react-router-dom';
import { createHashRouter } from 'react-router-dom';

import AccountPage from 'pages/AccountPage';
import CancelPage from 'pages/CancelPage';
import CartPage from 'pages/CartPage/CartPage';
import CatalogPage from 'pages/CatalogPage';
import FavoritesPage from 'pages/FavoritesPage/FavoritesPage';
import MainPage from 'pages/MainPage';
import ProductPage from 'pages/ProductPage';
import RootLayout from 'pages/RootLayout';
import SuccessPage from 'pages/SuccessPage';

// export const router = createBrowserRouter(
export const router = createHashRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <MainPage /> },
        {
          path: ':category',
          children: [
            { index: true, element: <CatalogPage /> },
            { path: ':product_url', element: <ProductPage /> },
          ],
        },
        { path: 'favorite', element: <FavoritesPage /> },
        { path: 'cart', element: <CartPage /> },
        { path: 'success', element: <SuccessPage /> },
        { path: 'cancel', element: <CancelPage /> },
        { path: 'account', element: <AccountPage /> },
      ],
    },
  ],
  // { basename: import.meta.env.BASE_URL }
);