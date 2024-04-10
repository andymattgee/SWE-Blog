
// Required for working with file and directory paths
const path = require('path');
// Imports the HtmlWebpackPlugin, a plugin for generating an HTML file to serve the webpack bundles
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Exports the configuration object for Webpack
module.exports = {
    // Sets the mode based on the NODE_ENV environment variable (development or production)
    mode: process.env.NODE_ENV,
    // Entry point(s) for the application
    entry: {
        index: './client/src/index.js',
    },
    // Configuration for the output of the build
    output: {
        // The filename of the output bundle
        filename: 'bundle.js',
        // The path to the output directory
        path: path.join(__dirname, 'build'),
        // The public URL of the output directory when referenced in a browser
        publicPath: '/',
        // Cleans the output directory before emitting
        clean: true,
        // Specifies the naming convention for assets
        assetModuleFilename: '[name][ext]'
    },
    // Option for source maps for debugging (shows source code in browser devtools)
    devtool: 'source-map',
    // Configuration for the webpack-dev-server
    devServer: {
        // Serve static files from the build directory
        static: {
            directory: path.resolve(__dirname, 'build'),
            publicPath: '/build/',
        },
        // Fallback to index.html for Single Page Applications
        historyApiFallback: true,
        // Port to run the devServer
        port: 3000,
        // Automatically open the browser
        open: true,
        // Enables hot module replacement for CSS/JS
        hot: true,
        // Enable gzip compression
        compress: true,

    },
    // Disable performance hints (e.g., asset size warnings)
    performance: {
        hints: false,
    },
    // Plugins configuration
    plugins: [
        // Generates an HTML file to serve the webpack bundles
        new HtmlWebpackPlugin({
            title: "testapp",
            template: './client/public/index.html'
        })
    ],
    // Configuration for modules (how different types of files are treated)
    module: {
        rules: [
            {
                // Test for JavaScript files to use babel-loader
                test: /\.(?:js|jsx|mjs|cjs)$/,
                // Exclude node_modules from processing
                exclude: /node_modules/,
                // Use babel-loader for JS/JSX files
                use: {
                    loader: 'babel-loader',
                    // Presets used for transpiling
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react',]
                    }
                }
            },
            {
                // Test for CSS and SCSS files
                test: /\.(css|scss)$/i,
                // Only include files from the specified directory
                include: path.resolve(__dirname, 'src'),
                // Use these loaders in sequence for CSS/SCSS files
                use: [
                    "style-loader", // Injects styles into the DOM
                    "css-loader", // Translates CSS into CommonJS
                    "sass-loader", // Compiles Sass to CSS
                    "postcss-loader" // Process CSS with PostCSS
                ],
            },
            {
                // Loader for image files to handle them as assets/resources
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
        ]
    },
    // Automatically resolve these extensions
    resolve: {
        extensions: [".*", ".js", ".jsx"]
    }
}
