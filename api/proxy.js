const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
    let target = ''
    
    // 测试节点
    if (req.url.startsWith('/flashbots_test_cors')) {
        target = 'https://relay-goerli.flashbots.net/'
    }
    // 主网
    if (req.url.startsWith('/flashbots_cors')) {
        target = 'https://relay.flashbots.net/'
    }

    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            // 路径重写，去掉xxx路径
            '^/flashbots_test_cors': '/',
            '^/flashbots_cors': '/'
        }
    })(req, res)
    
}