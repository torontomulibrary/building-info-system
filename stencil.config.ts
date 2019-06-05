import { Config } from '@stencil/core';
import { postcss } from '@stencil/postcss';
import { sass } from '@stencil/sass';

export const config: Config = {
  enableCache: true,
  nodeResolve: {
    // Default values from Stencil:
    // mainFields: ['collection:main', 'jsnext:main', 'es2017', 'es2015', 'module', 'main'],
    // Right now, there is a typo in the NDX packages that has the es2015 entry
    // pointing to an invalid es2015 directory. so cut out those entries for now.
    mainFields: ['collection:main', 'jsnext:main', 'es2017', 'module', 'main'],
  },
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
