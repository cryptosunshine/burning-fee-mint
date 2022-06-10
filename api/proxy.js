const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
    let target = ''

    if (req.url.startsWith('/CORS')) {
        target = 'https://relay-goerli.flashbots.net/'
    }

    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            // 路径重写，去掉CORS路径
            '^/CORS': '/'
        }
    })(req, res)
}