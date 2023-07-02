import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51Ms9C8SFYhfLf3FYwZUHLFqA7WKZ7GZTZJoCrqvwLudn5s4GnZQR6SXE4gfSMo8mE4E0ddYYABK3aIcUcYxDEEuH00C5iDGrdZ');

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<BrowserRouter>
		<Elements stripe={stripePromise}>
			<App />
		</Elements>
	</BrowserRouter>
);
