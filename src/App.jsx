import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import RootLayout from './pages/RootLayout';
import MainPage from './pages/MainPage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';

function App() {
  const categories = ['women', 'men'];

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
          }
        ]
      }
    ]
  }
]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;