module.exports = {
    root: true,
    extends: 'airbnb-base',
    rules: {
        // Kept from airbnb-base@13, that switched to 'always' in 14
        'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
        indent: ['error', 4],
        'no-console': 'off',
        'no-plusplus': 'off',
        'no-underscore-dangle': 'off',
        'operator-linebreak': 'off',
        'padded-blocks': 'off',
        'valid-jsdoc': ['error', {
            prefer: {
                'arg': 'param',
                'return': 'return',
            },
            preferType: {
                'boolean': 'Boolean',
                'function': 'Function',
                'number': 'Number',
                'object': 'Object',
                'string': 'String',
            },
        }],
    },
    overrides: [{
        files: ['spec/**'],
        plugins: [
            'jest',
        ],
        env: {
            jest: true,
        },
        rules: {
            'no-console': 'off',
        },
    }],
};
