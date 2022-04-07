import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary, LazyLoader } from '../components';

const LandingPage = lazy(() => import('./landing'));
const IpsumPage = lazy(() => import('./ipsum'));

const Router = () => (
	<ErrorBoundary>
		<BrowserRouter>
			<Suspense fallback={<LazyLoader />}>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/ipsum" element={<IpsumPage />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	</ErrorBoundary>
);

export { Router };
