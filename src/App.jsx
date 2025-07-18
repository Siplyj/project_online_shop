import { RouterProvider, createBrowserRouter } from 'react-router-dom';

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
  ]);

  return <RouterProvider router={router} />;
}

export default App;
