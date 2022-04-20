import React, { Suspense, lazy, FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LazyLoader } from '../components';

const LandingPage = lazy(() => import('./landing'));
const IpsumPage = lazy(() => import('./ipsum'));

export const Router: FC = () => (
	<BrowserRouter>
		<Suspense fallback={<LazyLoader />}>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/ipsum" element={<IpsumPage />} />
			</Routes>
		</Suspense>
	</BrowserRouter>
);
