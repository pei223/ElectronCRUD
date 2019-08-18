const path = require('path');
require("fs")

// NeDBのために必要
const fixNedbForElectronRenderer = {
  apply(resolver) {
    resolver
      // Plug in after the description file (package.json) has been
      // identified for the import, which makes sure we're not getting
      // mixed up with a different package.
      .getHook("beforeDescribed-relative")
      .tapAsync(
        "FixNedbForElectronRenderer",
        (request, resolveContext, callback) => {
          // When a require/import matches the target files, we
          // short-circuit the Webpack resolution process by calling the
          // callback with the finalized request object -- meaning that
          // the `path` is pointing at the file that should be imported.
          const isNedbImport = request.descriptionFileData["name"] === "nedb"

          if (isNedbImport && /storage(\.js)?/.test(request.path)) {
            const newRequest = Object.assign({}, request, {
              path: resolver.join(
                request.descriptionFileRoot,
                "lib/storage.js"
              )
            })
            callback(null, newRequest)
          } else if (
            isNedbImport &&
            /customUtils(\.js)?/.test(request.path)
          ) {
            const newRequest = Object.assign({}, request, {
              path: resolver.join(
                request.descriptionFileRoot,
                "lib/customUtils.js"
              )
            })
            callback(null, newRequest)
          } else {
            // Calling `callback` with no parameters proceeds with the
            // normal resolution process.
            return callback()
          }
        }
      )
  }
}

const config = {
  target: 'electron-renderer',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: path.resolve(__dirname, 'node_modules'),
      loader: 'babel-loader',
      query:{
          presets: ['es2015', 'react',],
      },
    },],
  },
  entry: {
    "main/app": "./src/main/app.js",
    "renderer/root": "./src/renderer/root.jsx"
  },
  output: {
    filename: "[name].js"
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: [
    '.jsx', '.js'
    ],
    plugins: [fixNedbForElectronRenderer]
  },
  mode: "production"
};
module.exports = config;
