import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('test smoke', () => {
	it('smoke test', () => {
		render(<div>loading</div>);
		expect(screen.getByText('loading')).to.exist;
		expect(userEvent).to.eq(userEvent);
	});
});
