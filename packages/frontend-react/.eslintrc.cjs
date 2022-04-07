require('dotenv').config();

const { NODE_ENV } = process.env;
console.log('|>> NODE_ENV in eslint config ===>', NODE_ENV);

module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		ecmaFeatures: {
			jsx: true
		},
		project: './tsconfig.json'
	},
	settings: {
		react: {
			version: 'detect'
		}
	},
	env: {
		browser: true,
		es2020: true
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier'
	],
	plugins: ['simple-import-sort'],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/ban-ts-comment': 0,
		'@typescript-eslint/no-unsafe-assignment': 0, // https://github.com/typescript-eslint/typescript-eslint/issues/2109
		'@typescript-eslint/no-unsafe-call': 0, // https://github.com/typescript-eslint/typescript-eslint/issues/2109
		'@typescript-eslint/no-unsafe-return': 0, // https://github.com/typescript-eslint/typescript-eslint/issues/2109
		'@typescript-eslint/no-unsafe-member-access': 0 // https://github.com/typescript-eslint/typescript-eslint/issues/2109
	}
};
