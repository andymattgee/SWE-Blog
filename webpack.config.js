
// Required for working with file and directory paths
const path = require('path');
// Imports the HtmlWebpackPlugin, a plugin for generating an HTML file to serve the webpack bundles
const HtmlWebpackPlugin = require("html-webpack-plugin");
// Import the React Refresh plugin
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// Exports the configuration object for Webpack
// Determine if it's development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    // Sets the mode based on the NODE_ENV environment variable (development or production)
    mode: isDevelopment ? 'development' : 'production',
    // Entry point(s) for the application
    entry: {
        index: './client/src/index.js',
    },
    // Configuration for the output of the build
    output: {
        // The filename of the output bundle
        filename: 'bundle.js',
        // The path to the output directory
        path: path.join(__dirname, './build'),
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
            directory: path.resolve(__dirname, './build'),
            publicPath: '/',
        },
        // Fallback to index.html for Single Page Applications
        historyApiFallback: true,
        // Port to run the devServer
        port: 3000,
        // Automatically open the browser to new window w localhost3000
        // open: true,
        // Enables hot module replacement for CSS/JS
        hot: true,
        // Enable gzip compression
        compress: true,
        // liveReload: true,
        // Proxy configuration for API requests
        proxy: [{
            context: ['/api'],
            target: 'http://localhost:3333',
            secure: false,
            changeOrigin: true
        }],

    },
    // Disable performance hints (e.g., asset size warnings)
    performance: {
        hints: false,
    },
    // Plugins configuration
    plugins: [
        // Generates an HTML file to serve the webpack bundles
        new HtmlWebpackPlugin({
            title: "SWE-Blog",
            template: './client/public/index.html'
        }),
        // Add React Refresh plugin only in development
        isDevelopment && new ReactRefreshWebpackPlugin(), // Corrected && and comma placement
    ].filter(Boolean), // Apply filter to the whole array
    // Configuration for modules (how different types of files are treated)
    module: {
        rules: [
            {
                // Test for JavaScript files to use babel-loader
                test: /\.(?:js|jsx|mjs|cjs)$/,

                // Exclude node_modules from processing
                exclude: /node_modules/,
                // Use babel-loader for JS/JSX files
                // Use babel-loader for JS/JSX files
                // No options needed here, babel.config.js is used automatically
                use: 'babel-loader'
            },
            {
                // Test for CSS and SCSS files
                test: /\.css$/i,
                // Use these loaders in sequence for CSS/SCSS files
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "sass-loader",
                ],
            },
            {
                // Loader for image files to handle them as assets/resources
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                // Loader for video files to handle them as assets/resources (npm install file-loader)
                test: /\.(mp4)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'videos/[name].[ext]',
                    },
                },
            }
        ]
    },
    // Automatically resolve these extensions
    resolve: {
        extensions: [".*", ".js", ".jsx", ".ts", ".tsx", ".gif", ".png", ".svg", ".jpg", ".jpeg", ".mjs", ".cjs"],
    }
}
