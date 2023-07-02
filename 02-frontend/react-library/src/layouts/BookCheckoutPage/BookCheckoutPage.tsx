import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import ReviewModel from '../../models/ReviewModel';
import ReviewRequest from '../../models/ReviewRequest';
import { SpinnerLoader } from '../Utils/SpinnerLoader';
import { StarsReview } from '../Utils/StarsReview';
import { CheckoutAndReviewBox } from './CheckoutAndReviewBox';
import { LatestReviews } from './LatestReviews';

export const BookCheckoutPage = () => {
	const { authState } = useOktaAuth();

	const [book, setBook] = useState<BookModel>();
	const [isLoading, setIsLoading] =
		useState(true);
	const [httpError, setHttpError] =
		useState(null);

	const [review, setReview] = useState<
		ReviewModel[]
	>([]);
	const [rating, setRating] = useState(0);
	const [reviewLoading, isReviewLoading] =
		useState(true);
	const [
		currentLoansCount,
		setCurrentLoansCount,
	] = useState(0);
	const [
		isLoadingCurrentLoansCount,
		setIsLoadingCurrentLoansCount,
	] = useState(true);

	const [isCheckedout, setIsCheckedout] =
		useState(false);

	const [
		isLoadingCheckedout,
		setIsLoadingCheckedout,
	] = useState(true);

	const [isReviewed, setIsReviewed] =
		useState(false);

	const [
		isReviewedLoading,
		setIsReviewedLoading,
	] = useState(false);

	const [displayError, setDisplayError] =
		useState(false);

	const bookId =
		window.location.pathname.split('/')[2];

	useEffect(() => {
		const fetchBooks = async () => {
			const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;

			const response = await fetch(baseUrl);

			if (!response.ok) {
				throw new Error(
					'Failed to get response!!'
				);
			}

			const responseJson = await response.json();

			const {
				id,
				title,
				author,
				description,
				img,
				copies,
				copiesAvailable,
				category,
			} = responseJson;

			const loadedBook: BookModel = {
				id,
				title,
				author,
				description,
				img,
				copies,
				copiesAvailable,
				category,
			};

			setBook(loadedBook);
			setIsLoading(false);
		};

		fetchBooks().catch((error: any) => {
			setIsLoading(false);
			setHttpError(error.message);
		});
	}, [isCheckedout]);

	useEffect(() => {
		const fetchReviews = async () => {
			const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;

			const reviewResponse: any = await fetch(
				reviewUrl
			);

			if (!reviewResponse.ok) {
				throw new Error('something went wrong!');
			}

			const responseJson =
				await reviewResponse.json();

			const reviews =
				responseJson._embedded.reviews;

			const loadedReviews: ReviewModel[] = [];

			let weightedStarRating: number = 0;

			for (let review of reviews) {
				const {
					id,
					date,
					userEmail,
					rating,
					reviewDescription,
					bookId,
				} = review;
				loadedReviews.push({
					id,
					date,
					userEmail,
					rating,
					reviewDescription,
					bookId,
				});

				weightedStarRating += review.rating;
			}

			if (loadedReviews.length > 0) {
				const avgRating = (
					Math.round(
						(weightedStarRating /
							loadedReviews.length) *
							2
					) / 2
				).toFixed(1);

				setRating(Number(avgRating));
			}
			setReview(loadedReviews);
			isReviewLoading(false);
		};

		fetchReviews().catch((error: any) => {
			isReviewLoading(false);
			setHttpError(error.message);
		});
	}, [isReviewed]);

	useEffect(() => {
		const fetchUserCurrentLoansCount =
			async () => {
				if (
					authState &&
					authState.isAuthenticated
				) {
					const url = `${process.env.REACT_APP_API}/books/secure/checkout/currentLoans`;

					const requestOptions = {
						method: 'GET',
						headers: {
							authorization: `Bearer ${authState.accessToken?.accessToken}`,
						},
						'Content-Type': 'application/json',
					};

					const response = await fetch(
						url,
						requestOptions
					);

					if (!response.ok) {
						throw new Error(
							'Something went wrong!'
						);
					}

					const responseJson =
						await response.json();

					setCurrentLoansCount(responseJson);

					setIsLoadingCurrentLoansCount(false);
				}
			};

		fetchUserCurrentLoansCount().catch(
			(err: any) => {
				setIsLoadingCurrentLoansCount(false);
				setHttpError(err.message);
			}
		);
	}, [authState, isCheckedout]);

	useEffect(() => {
		const fetchUserBookCheckedout = async () => {
			if (
				authState &&
				authState.isAuthenticated
			) {
				const url = `${process.env.REACT_APP_API}/books/secure/checkout/isCheckedout?bookId=${bookId}`;

				const requestOptions = {
					method: 'GET',
					headers: {
						authorization: `Bearer ${authState.accessToken?.accessToken}`,
					},
					'Content-Type': 'application/json',
				};

				const response = await fetch(
					url,
					requestOptions
				);

				if (!response.ok) {
					throw new Error(
						'Something went wrong!'
					);
				}

				const responseJson =
					await response.json();

				setIsCheckedout(responseJson);
				setIsLoadingCheckedout(false);
			}
		};

		fetchUserBookCheckedout().catch(
			(err: any) => {
				setIsLoadingCheckedout(false);
				setHttpError(err.message);
			}
		);
	}, [authState, isCheckedout]);

	useEffect(() => {
		const fetchUserReview = async () => {
			const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;

			const requestOptions = {
				method: 'GET',
				headers: {
					authorization: `Bearer ${authState?.accessToken?.accessToken}`,
					'Content-Type': 'application/json',
				},
			};

			const response = await fetch(
				url,
				requestOptions
			);

			if (!response.ok)
				throw new Error('Something went wrong!');

			const responseJson = await response.json();

			setIsReviewed(responseJson);

			setIsReviewedLoading(false);
		};

		fetchUserReview().catch((err: any) => {
			setIsReviewedLoading(false);
			setHttpError(err.message);
		});
	}, [authState]);

	if (isLoading) return <SpinnerLoader />;

	if (httpError) {
		return (
			<div className='container m-5'>
				<p>{httpError}</p>
			</div>
		);
	}

	const postReview = async (
		starRating: number,
		reviewDescription: string
	) => {
		const url = `${process.env.REACT_APP_API}/reviews/secure`;

		let bookId = 0;

		if (book?.id) bookId = book?.id;

		let newReview = new ReviewRequest(
			bookId,
			starRating,
			reviewDescription
		);

		const requestOptions = {
			method: 'POST',
			headers: {
				authorization: `Bearer ${authState?.accessToken?.accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newReview),
		};

		const response = await fetch(
			url,
			requestOptions
		);

		if (!response.ok)
			throw new Error('Something went wrong!');

		setIsReviewed(true);
	};
	const checkoutBook = async () => {
		const url = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${bookId}`;

		const requestOptions = {
			method: 'PUT',
			headers: {
				authorization: `Bearer ${authState?.accessToken?.accessToken}`,
				'Content-Type': 'application/json',
			},
		};

		const response = await fetch(
			url,
			requestOptions
		);

		if (!response.ok) {
			setDisplayError(true);
			throw new Error('Something went wrong!');
		}

    setDisplayError(false);
		setIsCheckedout(true);
	};
	return (
		<div>
			<div className='container d-none d-lg-block'>
				{displayError && (
					<div
						className='alert alert-danger mt-3'
						role='alert'>
						Please pay outstanding fees and/or
						return book;
					</div>
				)}
				<div className='row mt-5'>
					<div className='container col-sm-2 col-md-2'>
						{book?.img ? (
							<img
								src={book?.img}
								alt='book'
								height='400'
								width='300'
							/>
						) : (
							<img
								src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
								alt='book'
								height='400'
								width='300'
							/>
						)}
					</div>
					<div className='col-4 col-md-4 container'>
						<div className='ml-2'>
							<h2>{book?.title}</h2>
							<h5 className='text-primary'>
								{book?.author}
							</h5>
							<p className='lead'>
								{book?.description}
							</p>
							<StarsReview
								rating={rating}
								size={32}
							/>
						</div>
					</div>
					<CheckoutAndReviewBox
						book={book}
						mobile={false}
						currentLoansCount={currentLoansCount}
						isCheckedout={isCheckedout}
						isAuthenticated={
							authState?.isAuthenticated
						}
						checkoutBook={checkoutBook}
						isAlreadyReviewed={isReviewed}
						postReview={postReview}
					/>
					<hr />
					<LatestReviews
						reviews={review}
						bookId={book?.id}
						mobile={true}
					/>
				</div>
			</div>
			{/* Mobile Checkout View */}
			<div className='container d-lg-none mt-5'>
				{displayError && (
					<div
						className='alert alert-danger mt-3'
						role='alert'>
						Please pay outstanding fees and/or
						return book;
					</div>
				)}
				<div className='d-flex flex-column justify-content-center align-items-center'>
					{book?.img ? (
						<img
							src={book?.img}
							alt='book'
							height='400'
							width='300'
						/>
					) : (
						<img
							src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
							alt='book'
							height='400'
							width='300'
						/>
					)}
					<div className='mt-4'>
						<div className='ml-2'>
							<h2>{book?.title}</h2>
							<h5 className='text-primary'>
								{book?.author}
							</h5>
							<p className='lead'>
								{book?.description}
							</p>
							<StarsReview
								rating={rating}
								size={32}
							/>
						</div>
					</div>
					<CheckoutAndReviewBox
						book={book}
						mobile={true}
						currentLoansCount={currentLoansCount}
						isCheckedout={isCheckedout}
						isAuthenticated={
							authState?.isAuthenticated
						}
						checkoutBook={checkoutBook}
						isAlreadyReviewed={isReviewed}
						postReview={postReview}
					/>
				</div>

				<hr />
				<LatestReviews
					reviews={review}
					bookId={book?.id}
					mobile={true}
				/>
			</div>
		</div>
	);
};
