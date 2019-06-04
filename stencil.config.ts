import { Config } from '@stencil/core';
import { postcss } from '@stencil/postcss';
import { sass } from '@stencil/sass';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

export const config: Config = {
  enableCache: true,
  namespace: 'rlf',
  outputTargets: [
    {
      type: 'dist',
    },
    {
      baseUrl: '/',
      serviceWorker: undefined,
      type: 'www',
    },
  ],
  plugins: [
    globals(),
    builtins(),
    sass({
      injectGlobalPaths: [
        './src/global/_variables.scss',
        './src/global/_mixins.scss',
        './src/global/_fonts.scss',
      ],
      includePaths: ['./node_modules', './src/global'],
    }),
    postcss({
      plugins: [require('autoprefixer')],
    }),
  ],
  testing: {
    coverageDirectory: './coverage',
    collectCoverage: true,
  },
};
