module.exports = {
	env: {
		browser: true,
		es6: true
	},
	extends: ['eslint:recommended', 'plugin:vue/essential'],
	globals: {
		module: 'writable',
		global: 'readonly',
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
		import: 'readonly',
		export: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 11,
		sourceType: 'module'
	},
	plugins: ['vue', 'html'],
	rules: {
		'vue/script-indent': ['error', 4, { baseIndent: 1 }],
		indent: [2, 4], // 强制使用一致的缩进
		eqeqeq: [2, 'smart'], // 要求使用 === 和 !==
		quotes: [2, 'single'] // 强制使用一致的反勾号、双引号或单引号
	},
	overrides: [{ files: ['*.vue'], rules: { indent: 'off' } }]
}
