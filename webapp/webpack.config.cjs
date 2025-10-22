const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  // Inject REACT_APP_* environment variables
  const envVars = {};
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('REACT_APP_')) {
      envVars[`process.env.${key}`] = JSON.stringify(process.env[key]);
    }
  });

  return {
    entry: path.resolve(__dirname, 'src/main.tsx'),
    output: {
      path: path.resolve(__dirname, '../webroot'),
      filename: 'assets/[name].[contenthash:8].js',
      clean: true,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: true,
              }
            }
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext]',
          },
        },
        {
          test: /\.svg$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/icons/[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        filename: 'index.html',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public'),
            to: path.resolve(__dirname, '../webroot'),
          },
          {
            from: path.resolve(__dirname, '../node_modules/@fortawesome/fontawesome-free/webfonts'),
            to: path.resolve(__dirname, '../webroot/webfonts'),
          },
        ],
      }),
      new webpack.DefinePlugin(envVars),
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, '../webroot'),
      },
      port: 5173,
      hot: true,
      open: false,
      host: '0.0.0.0',
      historyApiFallback: true,
    },
    devtool: isDevelopment ? 'source-map' : false,
  };
};
