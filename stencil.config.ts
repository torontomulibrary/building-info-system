import { Config } from '@stencil/core';
import { postcss } from '@stencil/postcss';
import { sass } from '@stencil/sass';

export const config: Config = {
  enableCache: true,
  namespace: 'rl-bis',
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
    sass({
      injectGlobalPaths: [
        './src/global/_variables.scss',
        './src/global/_mixins.scss',
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
