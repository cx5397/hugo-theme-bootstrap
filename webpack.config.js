const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob-all');
const PATHS = {
  layouts: path.join(__dirname, 'layouts'),
  src: path.join(__dirname, 'src')
}

module.exports = {
  entry: {
    app: './src/app/index.ts',
    search: ['./src/search/index.ts'],
    katex: ['./src/katex/index.ts', './src/katex/index.scss'],
    mermaid: ['./src/mermaid/index.ts'],
    utterances: ['./src/utterances/index.ts'],
    viewer: ['./src/viewer/index.ts', './src/viewer/index.scss'],
    'service-worker': ['./src/service-worker/index.ts'],
  },
  mode: 'production',
  devtool: 'inline-source-map',
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  output: {
    path: path.resolve(path.join(__dirname, 'assets')),
    filename: '[name]/index.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          /*{
            loader: 'style-loader'
          },*/
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(ttf|woff2?)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../../static/fonts',
              publicPath: '/fonts'
            },
          },
        ],
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', 'jsx' ],
  },
  plugins: [
    new ESLintPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]/index.css'
    }),
    new PurgecssPlugin({
      paths: glob.sync([`${PATHS.layouts}/**/*`, `${PATHS.src}/app/js/**/*`],  { nodir: true }),
      only: ['app'],
      safelist: {
        standard: [
        ],
        deep: [
        ],
        greedy: [
        ]
      },
    })
  ]
};
