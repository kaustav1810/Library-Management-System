import { useOktaAuth } from '@okta/okta-react';
import React, {
	useEffect,
	useState,
} from 'react';
import { SpinnerLoader } from '../Utils/SpinnerLoader';
import { CardElement } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';

export default function PaymentPage() {
	const { authState } = useOktaAuth();

	const [httpError, setHttpError] =
		useState(null);
	const [submitDisabled, setSubmitDisabled] =
		useState(false);
	const [fees, setFees] = useState(0);
	const [isLoadingFees, setIsLoadingFees] =
		useState(true);

	useEffect(() => {
		const fetchFees = async () => {
			if (
				authState &&
				authState.isAuthenticated
			) {
				const url = `${process.env.REACT_APP_API}/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;

				const requestOptions = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
				};

				const paymentResponse = await fetch(
					url,
					requestOptions
				);

				if (!paymentResponse.ok) {
					throw new Error('something went wrong');
				}

				const responseJson =
					await paymentResponse.json();

				setFees(responseJson.amount);
				setIsLoadingFees(false);

				// if (paymentResponse.ok) {
                //     const paymentResponseJson = await paymentResponse.json();
                //     setFees(paymentResponseJson.amount);
                //     setIsLoadingFees(false);
                // } else if (paymentResponse.status === 404) {
                //     setFees(0);
                //     setIsLoadingFees(false);
                // } else {
                //     throw new Error('Something went wrong!')
                // }
			}
		};

		fetchFees().catch((err: any) => {
			setIsLoadingFees(false);
			setHttpError(err.message);
		});
	}, [authState]);

	if (isLoadingFees) return <SpinnerLoader />;

	if (httpError) {
		return (
			<div className='mt-2'>{httpError}</div>
		);
	}
	return (
		<>
			<div className='container'>
				{fees > 0 && (
					<div className='card mt-3'>
						<h5 className='card-header'>
							Fees pending:{' '}
							<span className='text-danger'>
								{fees}
							</span>{' '}
						</h5>
						<div className='card-body'>
							<h5 className='card-title mb-3'>
								Credit Card
							</h5>
							<CardElement id='card-element' />
							<button
								type='button'
								disabled={submitDisabled}
								className='btn btn-md main-color text-white mt-3'>
								Pay Fees
							</button>
						</div>
					</div>
				)}

				{fees === 0 && (
					<div className='mt-3'>
						<h5>You have no fees!</h5>
						<Link
							to='search'
							type='button'
							className='btn main-color text-white'>
							Explore top books
						</Link>
					</div>
				)}

                {submitDisabled && <SpinnerLoader/>}
			</div>
		</>
	);
}
