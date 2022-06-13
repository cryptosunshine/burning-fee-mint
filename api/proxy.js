const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {

    // 测试节点
    createProxyMiddleware({
        target: 'https://relay-goerli.flashbots.net/',
        changeOrigin: true,
        pathRewrite: {
            // 路径重写，去掉xxx路径
            '^/flashbots_test_cors': '/'
        }
    })(req, res);

    // 主网
    createProxyMiddleware({
      target: 'https://relay.flashbots.net/',
      changeOrigin: true,
      pathRewrite: {
          // 路径重写，去掉xxx路径
          '^/flashbots_cors': '/'
      }
    })(req, res);

    
}