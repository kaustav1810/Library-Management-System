import { useOktaAuth } from '@okta/okta-react';
import { Link, NavLink } from 'react-router-dom';
import { SpinnerLoader } from '../Utils/SpinnerLoader';

export const Navbar = () => {
	const { oktaAuth, authState } = useOktaAuth();

	if (!authState) {
		return <SpinnerLoader />;
	}

	console.log(authState);

	const handleLogout = async () =>
		await oktaAuth.signOut();

	return (
		<nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
			<div className='container-fluid'>
				<NavLink
					to='/'
					style={{ textDecoration: 'none' }}>
					<span className='navbar-brand'>
						Luv 2 Read
					</span>
				</NavLink>
				<button
					className='navbar-toggler'
					type='button'
					data-bs-toggle='collapse'
					data-bs-target='#navbarNavDropdown'
					aria-controls='navbarNavDropdown'
					aria-expanded='false'
					aria-label='Toggle Navigation'>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div
					className='collapse navbar-collapse'
					id='navbarNavDropdown'>
					<ul className='navbar-nav'>
						<li className='nav-item'>
							<NavLink
								to='/'
								className='nav-link'>
								Home
							</NavLink>
						</li>

						<li className='nav-item'>
							<NavLink
								to='/search'
								className='nav-link'>
								Search Books
							</NavLink>
						</li>
						{authState.isAuthenticated && (
							<>
								<li className='nav-item'>
									<NavLink
										to='/shelf'
										className='nav-link'>
										Shelf
									</NavLink>
								</li>
								<li className='nav-item'>
									<NavLink
										to='/fees'
										className='nav-link'>
										Pay Fees
									</NavLink>
								</li>
							</>
						)}

						{authState.isAuthenticated &&
							authState.accessToken?.claims
								.userType && (
								<li className='nav-item'>
									<NavLink
										to='/admin'
										className='nav-link'>
										Admin
									</NavLink>
								</li>
							)}
					</ul>
					<ul className='navbar-nav ms-auto'>
						{authState.isAuthenticated ? (
							<li>
								<button
									className='btn btn-outline-light'
									onClick={handleLogout}>
									Logout
								</button>
							</li>
						) : (
							<li className='nav-item m-1'>
								<Link
									to='/login'
									className='btn btn-outline-light'>
									Sign in
								</Link>
							</li>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};
