import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';

export const config: Config =  {
  enableCache: false,
  namespace: 'bis',
  globalScript: 'src/global/lazy-store.ts',
  plugins: [
    sass({ 
      injectGlobalPaths: [
        './src/global/_variables.scss',
        './src/global/_mixins.scss'
      ], 
      includePaths: ['./node_modules', './src/global']}),
    postcss({
      plugins: [require('autoprefixer')]
    })
  ],
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ]
};