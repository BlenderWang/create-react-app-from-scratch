const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// store source and dist paths in the following two variables
const PATH_SOURCE = path.join(__dirname, "./src");
const PATH_DIST = path.join(__dirname, "./dist");

// export a config obj
module.exports = env => {
    const environment = env.environment;
    const isProduction = environment === "production";
    const isDevelopment = environment === "development";

    return {
        // Tell Webpack to do some optimizations for our environment (development or production)
        mode: environment,

        devServer: {
            // the dev server will serve content from this directory
            contentBase: PATH_DIST,

            // specify a host (default to 'localhost')
            host: "localhost",

            // specify a port
            port: 8080,

            // index.html should be served in place of 404 response
            historyApiFallback: true,

            // show a full-screen overlay when there are compiler errors or warnings
            overlay: {
                errors: true,
                warnings: true
            }
        },

        // The point or points to enter the application
        entry: [path.join(PATH_SOURCE, "./index.js")],

        // Tell Webpack where to emit the bundles it creates and how to name them
        output: {
            path: PATH_DIST,
            filename: "js/[name].[hash].js"
        },

        // determine how the different types of modules will be treated
        module: {
            rules: [
                {
                    test: /\.js$/, // apply this rule to files ending in .js
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        // pass a config obj to the preset
                                        debug: true, // output the targets/plugins used when compiling
                                        useBuiltIns: "usage", //  config how @babel/preset-env handles polyfills from core-js
                                        corejs: 3 // specify corejs version
                                    }
                                ],

                                // The react preset includes several plugins that are required to write a React app.
                                "@babel/preset-react"
                            ]
                        }
                    }
                }
            ]
        },

        plugins: [
            // this plugin will generate an html5 file that imports all webpack bundles using <script> tags
            // the file will be placed in `output.path`
            new HtmlWebpackPlugin({
                template: path.join(PATH_SOURCE, "./index.html")
            }),

            // this plugin will delete all files inside `output.path` (the dist directory), but the directory itself will be kept
            new CleanWebpackPlugin()
        ]
    };
};
