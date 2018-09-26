import { Config } from '@stencil/core';
import { postcss } from '@stencil/postcss';
import { sass } from '@stencil/sass';

export const config: Config = {
  enableCache: false,
  namespace: 'rula-bis',
  outputTargets: [
    {
      type: 'dist',
    },
    {
      type: 'www',
      serviceWorker: undefined,
    },
  ],
  plugins: [
    sass({
      injectGlobalPaths: [
        './src/global/_variables.scss',
        './src/global/_mixins.scss',
      ],
      includePaths: ['./node_modules', './src/global']}),
    postcss({
      plugins: [require('autoprefixer')],
    }),
  ],
};
