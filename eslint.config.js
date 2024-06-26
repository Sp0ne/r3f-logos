import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  { files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'] },
  { ignores: ['**/*.{gitignore}'] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReactConfig,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-unknown-property': 'off',
      'react/prop-types': 'off',
      'no-console': 'off',
      'no-debugger': 'off',
      // "prettier/prettier": ["error", {}, { "usePrettierrc": true }],
      'import/no-extraneous-dependencies': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'no-useless-constructor': 'off',
      'no-empty-function': 'off',
      'class-methods-use-this': 'off',
      'no-plusplus': 'off',
      'no-restricted-globals': 'off',
      'no-param-reassign': 'off',
      'comma-dangle': 'off'
    }
  },
  eslintConfigPrettier
]
