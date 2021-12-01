module.exports = {
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	extends: ['airbnb-base', 'plugin:node/recommended', 'prettier'],
	roles: {
		'node/no-unsupported-features/es-syntax': 0
	}
}
