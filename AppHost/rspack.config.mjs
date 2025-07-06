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
      name: 'AppHost',
      filename: 'AppHost.container.js.bundle',
      remotes: {
        MicroApp: 'MicroApp@http://127.0.0.1:8081/android/MicroApp.container.js.bundle',
      },
      shared: Object.fromEntries(
        Object.entries(pkg.dependencies).map(([dep, version]) => [
          dep,
          {singleton: true, eager: true, requiredVersion: version},
        ])
      ),
    }),
  ],
};
