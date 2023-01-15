import * as path from "path";
import * as webpack from "webpack";

const config: webpack.Configuration = {
    mode: "production",
    externalsPresets: { node: true },
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }],
    },
    optimization: {
        minimize: false,
    },
};

export default config;