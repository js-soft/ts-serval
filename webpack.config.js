const path = require("path")
const webpack = require("webpack")

module.exports = {
    mode: "development",
    node: {
        global: false
    },
    entry: {
        tsserval: "./dist/index"
    },
    output: {
        path: path.resolve(__dirname, "lib-web"),
        filename: "[name].js",
        library: "TSServal",
        umdNamedDefine: true
    },
    resolve: {
        extensions: [".js", ".json"],
        alias: {
            src: path.resolve(__dirname, "tmp-browser/src/")
        }
    },
    devtool: "source-map",
    externals: {
        chai: "chai"
    }
}
