import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Redux
import { Provider } from 'react-redux';
import store from './store/store';

// Stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51RODaBPA4UzG8X8flr9u4BmC735vRiv12ekvURp3jhu3rt1OLkzz8NKRw1oL8WMHdseyGgj1FgiNmk6vsmzb8gft00rYgIuNNp');

//AWS
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
Amplify.configure(awsExports);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <Authenticator.Provider>
         <App />
        </Authenticator.Provider>
      </Elements>
    </Provider>
  </React.StrictMode>
);