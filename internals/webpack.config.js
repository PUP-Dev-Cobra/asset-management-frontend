require('dotenv').config()

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const DotEnvWebpack = require('dotenv-webpack')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const glob = require('glob')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const CssNano = require('cssnano')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = (env, options) => {
  const isDevMode = options.mode === 'development'
  const srcFolder = process.env.SCR_FOLDER
  const entryPath = process.env.WEBPACK_ENTRY_PATH
  const buildPath = process.env.WEBPACK_BUILD_PATH

  const plugins = [
    new DotEnvWebpack(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(srcFolder, 'index.html')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]

  if (!isDevMode) {
    // PWA
    plugins.push(
      new CopyWebpackPlugin([
        './app/site.webmanifest',
        './app/manifest.json',
        {
          from: './app/assets',
          to: 'assets'
        }
      ])
    )
    plugins.push(
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc: './app/sw-src.js',
        swDest: 'sw.js'
      })
    )
    // CSS Minifier
    plugins.push(new OptimizeCssAssetsPlugin({
      cssProcessor: CssNano
    }))
    // PurgeCSS
    plugins.push(new PurgecssPlugin({
      paths: glob.sync(
        path.resolve(
          __dirname, '..', srcFolder, '**', '*'
        ), { nodir: true }
      ),
      // Include any special characters you're using in this regular expression
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      only: ['main']
    }))
  }

  const config = {
    entry: {
      semantic: path.join(__dirname, '..', srcFolder, 'styles.js'),
      main: path.resolve(
        __dirname,
        '..',
        srcFolder,
        entryPath
      )
    },
    target: 'web',
    output: {
      path: path.join(__dirname, '..', buildPath),
      filename: '[name].[hash].bundle.js',
      chunkFilename: 'bundle.[hash].[chunkhash].js',
      publicPath: '/'
    },
    devtool: (isDevMode) ? 'inline-source-map' : false,
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
        App:
          path.resolve(__dirname, '..', srcFolder),
        Assets:
          path.resolve(__dirname, '..', srcFolder, 'assets'),
        Components:
          path.resolve(__dirname, '..', srcFolder, 'components'),
        Containers:
          path.resolve(__dirname, '..', srcFolder, 'containers'),
        RootContainers:
          path.resolve(__dirname, '..', srcFolder, 'rootContainers'),
        Helpers:
          path.resolve(__dirname, '..', srcFolder, 'helpers')
      }
    },
    plugins,
    devServer: {
      historyApiFallback: true,
      host: '0.0.0.0',
      port: 3100,
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            { loader: isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader },
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  require('tailwindcss'),
                  require('autoprefixer')
                ]
              }
            },
            { loader: 'sass-loader' }
          ]
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        },
        {
          test: /\.(jpe?g|png|gif|svg|ico)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'assets/'
              }
            }
          ]
        }
      ]
    },
    node: {
      fs: 'empty',
      child_process: 'empty'
    }
  }

  /*
  uncomment this if you want to analyze the build sizes of your build file
  if (!isDevMode) {
    config.plugins.push(
      new BundleAnalyzerPlugin()
    )
  }
  */

  return config
}
