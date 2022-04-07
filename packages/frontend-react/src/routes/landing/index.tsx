import { FC } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Landing: FC = () => (
	<div className="content">
		<h1>Choose your poison</h1>
		<Link to="/ipsum">Lorem Ipsum</Link>
	</div>
);

export default Landing;
