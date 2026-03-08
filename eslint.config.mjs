import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      curly: ['error', 'all'],
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'const' },
        { blankLine: 'always', prev: 'block', next: '*' }
      ],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/no-multi-spaces': 'error',

      '@stylistic/lines-between-class-members': ['error', 'always'],
      // THAY ĐỔI: ÉP XÓA TẤT CẢ DÒNG TRỐNG THỪA
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
      '@stylistic/padded-blocks': ['error', 'never'],
    },
  },
);
