import React, { FC, StrictMode } from 'react';
import { Router } from './routes';
import { ErrorBoundary } from './components';

export const App: FC = () => (
	<StrictMode>
		<ErrorBoundary>
			<Router />
		</ErrorBoundary>
	</StrictMode>
);
