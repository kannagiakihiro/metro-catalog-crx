const fs = require("fs")
const pathModule = require("path")
const webpack = require("webpack")
module.exports = {
    output: {
        path: pathModule.join(__dirname, "./serve"),
    },
    entry: {},
    resolve: {
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "process/browser": require.resolve("process/browser"),
            "buffer": require.resolve("buffer/"),
            "http": false,
            "request": false,
            "@root-ts/net": false,
            "events": require.resolve("events/"),
            "socks-proxy-agent": false,
            "net": false,
            "tls": false,
            //"util": require.resolve("util/"),
        },
        symlinks: true,
        extensions: [".js"]
    },
    devtool: false,
    optimization: {
        minimize: false
    },
    mode: "development",
    plugins: [{
        apply: (compiler) => {
            compiler.hooks.afterEmit.tap("AfterEmitPlugin", (compilation) => {
                //process.stdout.write("Run after compile")
                //fs.writeFileSync(pathModule.join(__dirname, "temp/serve/static/version"), new Date().toLocaleString())
                process.stdout.write("Updated version")
            });
        }
    }, new webpack.ProvidePlugin({
        process: "process/browser",
    }),
    new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    }),
    ]
}

let files = fs.readdirSync(pathModule.join(__dirname, "src/script/entry"))
for (let file of files) {
    let extname = pathModule.extname(file)
    if (extname !== ".ts") continue
    let basename = pathModule.basename(file, ".ts")
    module.exports.entry[basename] = pathModule.join(__dirname, "src/script/entry", basename + ".js")
}
console.error(module.exports)