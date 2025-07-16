import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import pkg from './package.json' with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Rspack configuration for AppHost - Module Federation Host
 * Following Re.Pack guide: https://re-pack.dev/docs/guides/configuration
 */

export default (env, ctx) => {
  const {
    mode = 'development',
    context,
    entry = './index.js',
    platform,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    reactNativePath = new URL('./node_modules/react-native', import.meta.url).pathname,
  } = env;

  const isProd = mode === 'production';

  return {
    context,
    entry,
    mode,
    devtool: isProd ? false : 'cheap-module-source-map',
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
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
        },
      }),
      // Temporarily disable Module Federation to avoid RUNTIME-006 errors
      // Will implement a custom remote component loader instead
      // new Repack.plugins.ModuleFederationPluginV2({
      //   name: 'AppHost',
      //   remotes: {
      //     MicroApp: 'MicroApp@http://10.0.2.2:8090/remoteEntry.js',
      //   },
      //   // Remove shared dependencies to avoid RUNTIME-006 error in React Native
      //   // React Native Module Federation doesn't handle shared dependencies well
      //   shared: {},
      // }),
    ],
    optimization: {
      minimize,
      ...(isProd && {
        usedExports: true,
        sideEffects: false,
      }),
    },
  };
};
