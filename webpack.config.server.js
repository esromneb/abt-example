const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');


const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv !== 'development';


// Common plugins
let plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(nodeEnv),
        },
    }),
    new webpack.NamedModulesPlugin()
];


// see https://medium.com/@christossotiriou/speed-up-nodejs-server-side-development-with-webpack-4-hmr-8b99a932bdda
// if (!isProduction) {
//     plugins.push(new webpack.HotModuleReplacementPlugin())
// }

    // 'webpack/hot/poll?1000',
const entry = path.resolve(path.join(__dirname, './src/server/server.ts'));


module.exports = {
    devtool: false,
    externals: [
        nodeExternals()
    ],
    name: 'server',
    plugins: plugins,
    entry: entry,
    output: {
        publicPath: './',
        path: path.resolve(__dirname, 'server_public'),
        filename: "bundle.server.js",
        // sourceMapFilename: "./[file].map[query]",
        // devtoolModuleFilenameTemplate: "./[file].map[query]",
        // library: 'main',
        libraryTarget: "commonjs2"

    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
        // alias: {
        //   'ape-ecs': path.resolve(__dirname, './node_modules/ape-ecs/src/index.js'),
        //   // 'ape-ecs/src/entity.js': './node_modules/ape-ecs/src/entity.js',
        // }
    },
    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ },
            // this matches any files under the ape-ecs folder
            // for some reason, the static members of class are forcing me to add this
            { test: /ape-ecs.*\.js?$/,
              
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                  plugins: [ "@babel/plugin-proposal-class-properties"]
                }
              }

            },
     {
        test: /\.xml/i,
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },

        ]
    },


    performance: {
      // hints: process.env.NODE_ENV === 'production' ? "warning" : false
      // hints: false,

    maxEntrypointSize: 1000000000, // set size limit warning to 100Mb
    maxAssetSize: 1000000000,      // set size limit warning to 100Mb
    },

    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
    }


}
