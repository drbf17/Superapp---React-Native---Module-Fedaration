import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import pkg from './package.json' with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  context: __dirname,
  entry: './index.js',
  mode: 'production',
  devtool: false,
  
  optimization: {
    usedExports: true,
    sideEffects: false,
    splitChunks: false,
    minimize: true,
    mangleExports: 'size',
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    providedExports: true,
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: 'bundle.js',
    publicPath: '/static/',
    clean: true,
    chunkFormat: 'commonjs',
  },
  
  resolve: {
    ...Repack.getResolveOptions(),
    alias: {
      '@react-native/polyfills': false,
    },
  },
  
  module: {
    rules: [
      ...Repack.getJsTransformRules(),
      ...Repack.getAssetTransformRules(),
    ],
  },
  
  plugins: [
    new Repack.plugins.ModuleFederationPluginV2({
      name: 'MicroApp',
      filename: 'MicroApp.container.js.bundle',
      dts: false,
      exposes: {
        './SimpleComponent': './components/SimpleComponent',
      },
      shared: {
        'react': {
          singleton: true,
          eager: false,
          requiredVersion: pkg.dependencies.react,
          import: false,
        },
        'react-native': {
          singleton: true,
          eager: false,
          requiredVersion: pkg.dependencies['react-native'],
          import: false,
        },
        'react/jsx-runtime': {
          singleton: true,
          eager: false,
          import: false,
        },
        'react-native/Libraries/EventEmitter/NativeEventEmitter': {
          singleton: true,
          eager: false,
          import: false,
        },
        'react-native/Libraries/Components/View/View': {
          singleton: true,
          eager: false,
          import: false,
        },
      },
    }),
  ],
  
  externals: {
    'react': 'react',
    'react-native': 'react-native',
    'react/jsx-runtime': 'react/jsx-runtime',
  },
};