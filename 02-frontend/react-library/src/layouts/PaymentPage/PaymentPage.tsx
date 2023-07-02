import { useOktaAuth } from '@okta/okta-react';
import React, {
	useEffect,
	useState,
} from 'react';
import { SpinnerLoader } from '../Utils/SpinnerLoader';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';
import PaymentInfoRequest from '../../models/PaymentInfoRequest';

export default function PaymentPage() {
	const { authState } = useOktaAuth();

	const [httpError, setHttpError] =
		useState(false);
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

	const elements = useElements();
	const stripe = useStripe();

	async function checkout(){
		if(!stripe || !elements || !(elements.getElement(CardElement))) return;

		setSubmitDisabled(true);

		let paymentInfo = new PaymentInfoRequest(Math.round(fees*100),'USD',authState?.accessToken?.claims.sub);

		const url=`https://localhost:8443/api/payment/secure/payment-intent`;

		const requestOptions = {
			method:'POST',
			Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
			headers:{
				'Content-Type':'application/json'
			},
			body:JSON.stringify(paymentInfo)
		}

		const stripePaymentResponse = await fetch(url,requestOptions);

		if(!stripePaymentResponse.ok){
			setHttpError(true);
			setSubmitDisabled(false);
			throw new Error('Something went wrong!')
		}

		const stripeResponseJson = await stripePaymentResponse.json();

		stripe.confirmCardPayment(stripeResponseJson.client_secret,{
			payment_method:{
				card: elements.getElement(CardElement)!,
				billing_details:{
					email:authState?.accessToken?.claims.sub
				}
			}
		},{handleActions:false}
		).then(async function(result:any){
			if(result.error){
				setSubmitDisabled(false);
				alert('There was an error')
			}

			else{
				const url = `https://localhost:8443/api/payment/secure/payment-complete`

				const requestOptions = {
					method:'PUT',
					headers:{
						Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
						'Content-Type':'application/json'
					}
				}

				const stripeResponse = await fetch(url,requestOptions);

				if(!stripeResponse.ok){
					setHttpError(true);
					setSubmitDisabled(false);
					throw new Error('Something went wrong!')
				}

				setFees(0);
				setSubmitDisabled(false);


			}
		})



	}
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
								onClick={checkout}
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
