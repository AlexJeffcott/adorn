import React, { FC } from 'react';
import { Router } from './routes';
import { ErrorBoundary } from './components';

export const App: FC = () => (
	<ErrorBoundary>
		<Router />
	</ErrorBoundary>
);
