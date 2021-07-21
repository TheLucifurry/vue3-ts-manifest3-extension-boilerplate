/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// See: DefinePlugin in webpack.config.js
declare const IS_DEV: boolean; // Same as (process.env.NODE_ENV !== 'production')