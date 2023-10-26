const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const BASE_JS = "./src/client/js/";
module.exports = {
    entry: {
        main: BASE_JS + "main.js",
        videoPlayer: BASE_JS + "videoPlayer.js",
        commentSection: BASE_JS + "commentSection.js",
        upload: BASE_JS + "upload.js",
        editprofile: BASE_JS + "editprofile.js",
        home: BASE_JS + "home.js",
        modal: BASE_JS + "modal.js",
        search: BASE_JS + "search.js",
        watch: BASE_JS + "watch.js",
    },
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css",
    })],
    mode: 'development',
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean: true
    },
    module: {
        rules: [
            {
                test:/\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]],
                    },
                },
            },
            {
                test: /\.scss$/,
                use:[MiniCssExtractPlugin.loader,"css-loader","sass-loader"],
            }
        ]
    }
}