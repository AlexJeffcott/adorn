import React from 'react';
import { expect } from 'chai';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';

describe('test App', () => {
	it('renders "loading" then a "Choose your poison" message', async () => {
		render(<App />);

		expect(screen.getByText('loading')).to.exist;
		await waitFor(() => expect(screen.getByText('Choose your poison')).to.exist);

		await act(() => userEvent.click(screen.getByText('Lorem Ipsum')));

		await waitFor(() => expect(screen.queryByText('Choose your poison')).to.not.exist);

		await waitFor(() => {
			const heading = screen.getByRole('heading');
			expect(heading).to.contain(/lorem/i);
			expect(screen.getByText(/Donec mattis, risus ut volutpat rutrum/i)).to.exist;
		});
	});
});
