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

      new Repack.plugins.ModuleFederationPluginV2({
        name: 'AppHost',
        remotes: {
          MicroApp: 'MicroApp@http://localhost:8090/MicroApp.container.js.bundle',
        },
        shared: {
          react: { singleton: true, eager: true },
          "react-native": { singleton: true, eager: true },
        },
      }),
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
