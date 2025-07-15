import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import pkg from './package.json' with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */

export default {
  context: __dirname,
  entry: './index.js',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  
  // Optimization for smaller bundles (without breaking externals)
  optimization: {
    usedExports: true, // Tree shaking
    sideEffects: false, // More aggressive tree shaking
    splitChunks: false, // Don't split chunks for micro-frontend
  },
  
  resolve: {
    ...Repack.getResolveOptions(),
  },
  module: {
    rules: [
      ...Repack.getJsTransformRules(),
      ...Repack.getAssetTransformRules(),
    ],
  },
  plugins: [
    new Repack.RepackPlugin(),
    new Repack.plugins.ModuleFederationPluginV2({
      name: 'MicroApp',
      filename: 'MicroApp.container.js.bundle',
      dts: false,
      exposes: {
        './SimpleComponent': './components/SimpleComponent',
      },
      shared: {
        // AppHost already provides these - MicroApp will consume them
        'react': {
          singleton: true,
          eager: false,
          requiredVersion: pkg.dependencies.react,
          import: false, // Don't bundle, consume from host
        },
        'react-native': {
          singleton: true,
          eager: false,
          requiredVersion: pkg.dependencies['react-native'],
          import: false, // Don't bundle, consume from host
        },
      },
    }),
  ],
};
