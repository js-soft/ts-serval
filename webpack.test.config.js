const path = require("path")
const webpack = require("webpack")

module.exports = {
    mode: "development",
    node: {
        global: false
    },
    entry: "./dist-test/index",
    output: {
        path: path.resolve(__dirname, "lib-web"),
        filename: "tsserval.test.js",
        library: "TSServalTest",
        umdNamedDefine: true
    },
    resolve: {
        extensions: [".js", ".json"],
        alias: {
            buffer: "buffer",
            src: path.resolve(__dirname, "tmp-browser/src/")
        }
    },
    devtool: "source-map",
    externals: {
        chai: "chai",
        "@js-soft/ts-serval": "TSServal"
    }
}
