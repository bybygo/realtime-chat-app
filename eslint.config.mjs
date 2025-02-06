import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import { dirname } from 'path';
import tslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

import eslintConfigBase from './eslint.base.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
  react: pluginReact.configs.recommended,
});

const patchedConfig = fixupConfigRules([...compat.extends('next/core-web-vitals')]);

const eslintConfig = [
  ...patchedConfig,
  ...tslint.configs.recommended,
  eslintConfigBase,
  prettierPluginRecommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  { ignores: ['**/node_modules/*', '**/out/*', '**/.next/*'] },
];

export default eslintConfig;
