const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        'loc': './src/main.ts',
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: "this"
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'awesome-typescript-loader',
            exclude: /node_modules/,
            query: {
                declaration: false,
            }
        }]
    },
    node: {
        fs: 'empty'
    }
}

