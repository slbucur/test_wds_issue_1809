const webpack = require('webpack')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const PATHS = {
    app: __dirname,
    build: path.join(__dirname, '../backend/static/dist')
}

const VENDOR = [
    'babel-polyfill',
    'react',
    'react-dom',
    'react-redux',
]

const isDevServer = process.argv[1].indexOf('webpack-dev-server') !== -1;

const getArg = (argName) => {
    const argIdx = process.argv.indexOf(`--${argName}`);
    return argIdx > -1 ? process.argv[argIdx + 1] : null;
};

const port = getArg('port') || 8080;
const djangoPort = getArg('django-port') || 9000;

const common = {
    context: path.resolve(__dirname),
    devtool: 'source-map', // source map to allow breakpoints in JSX to work properly
    mode: 'development',
    entry: {
        vendor: VENDOR,
        base: ['babel-polyfill', path.join(PATHS.app, 'base', 'entry.jsx')],
    },

    output: {
        path: PATHS.build,
        filename: isDevServer ? '[name].dist.js': '[name].dist.js',
        strictModuleExceptionHandling: true,
    },
    module: {

        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: { presets: ['env', 'react'] }
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader", // compiles Less to CSS
                    options: {
                        javascriptEnabled: true
                    }
                }]
            }

        ]
    },
    resolve: {
        extensions: ['.jsx', '.js', '.css', '.web.js', '.mjs', '.json', '.web.jsx', '.less'],
        modules: ['node_modules']
    },

    devServer: {
        historyApiFallback: true,
        publicPath: `http://localhost:${port}/`,
        proxy: {
            '*': `http://localhost:${djangoPort}`
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        port: 8080
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },
};

if (isDevServer) {
    common.output.publicPath = `http://localhost:${port}/`;
}

module.exports = common;