import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('test smoke', () => {
	it('smoke test', () => {
		expect(render).to.eq(render);
		expect(userEvent).to.eq(userEvent);
	});
});
