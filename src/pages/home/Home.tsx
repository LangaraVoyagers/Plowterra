import { Outlet } from 'react-router-dom';

const Home = () => {
	return (
		<div>
			Home
			<br />
			<a href="/contacts/1">Contact Detail</a>
			<br />
			<a href="/contacts/1/edit">Edit Contact</a>
			<br />
			<Outlet />
		</div>
	);
};

export default Home;
