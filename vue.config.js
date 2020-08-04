// const resolve = (dir) => require('path').join(__dirname, dir)
const PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const BrotliPlugin = require('brotli-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const zopfli = require('@gfx/zopfli')

/* let plugins = []
if (PROD) {
  const compressionTest = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
  plugins = [
    new CompressionPlugin({
      algorithm(input, compressionOptions, callback) {
        return zopfli.gzip(input, compressionOptions, callback)
      },
      compressionOptions: {
        numiterations: 15
      },
      minRatio: 0.99,
      test: compressionTest
    }),
    new BrotliPlugin({
      test: compressionTest,
      minRatio: 0.99
    })
  ]

} */

module.exports = {
  devServer: {
    publicPath: PROD ? './' : '/',
    open: true,
    proxy: {
      '/api': {
        target: 'http://rap2.taobao.org:38080/app/mock/237921',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  runtimeCompiler: true,
  productionSourceMap: !PROD,
  configureWebpack: (config) => {
    if (PROD) {
      const compressionTest = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
      config.plugins = [
        new CompressionPlugin({
          algorithm(input, compressionOptions, callback) {
            return zopfli.gzip(input, compressionOptions, callback)
          },
          compressionOptions: {
            numiterations: 15
          },
          minRatio: 0.99,
          test: compressionTest
        }),
        new BrotliPlugin({
          test: compressionTest,
          minRatio: 0.99
        })
      ]
    }
  }
}
