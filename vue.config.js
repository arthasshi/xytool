module.exports = {
    css: {
        /*为预处理器 loader 传递自定义选项*/
        loaderOptions: {
            sass: {
                prependData: `@import "@/style/index.scss";`
            }
        }
    },
    devServer: {
        proxy: {
            '/': {
                target: 'http://localhost:8081',
                ws: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            }
        }
    }
}