const webpack = require('webpack')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const djangoPort = 9000;
const wdsPort = 8080;

let djangoUrl = `http://localhost:${djangoPort}`;
let wdsUrl = `http://localhost:${wdsPort}`;

const gitPodUrl = process.env.GITPOD_WORKSPACE_URL;

if(gitPodUrl){
   djangoUrl = gitPodUrl.replace('https://', `https://${djangoPort}-`)
   wdsUrl = gitPodUrl.replace('https://', `https://${wdsPort}-`)
}

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
        publicPath: wdsUrl,
        proxy: {
            '*': djangoUrl
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        port: wdsPort,
        disableHostCheck: true
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
    common.output.publicPath = wdsUrl;
}

module.exports = common;