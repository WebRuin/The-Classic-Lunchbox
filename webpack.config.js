const path = require('path');
const webpack = require('webpack');
const minJSON = require('jsonminify');
const CopyPlugin = require('copy-webpack-plugin');
const sassVars = require(__dirname + '/src/js/colors.js');

const plugins = {
  progress: require('webpackbar'),
  clean: (() => {
    const { CleanWebpackPlugin } = require('clean-webpack-plugin');
    return CleanWebpackPlugin;
  })(),
  extractCSS: require('mini-css-extract-plugin'),
  sync: require('browser-sync-webpack-plugin'),
  html: require('html-webpack-plugin'),
  copy: require('copy-webpack-plugin'),
  sri: require('webpack-subresource-integrity')
};

// Convert js strings to dimenssions
const convertStringToSassDimension = function(result) {
  // Only attempt to convert strings
  if (typeof result !== 'string') {
    return result;
  }

  const cssUnits = [
    'rem',
    'em',
    'vh',
    'vw',
    'vmin',
    'vmax',
    'ex',
    '%',
    'px',
    'cm',
    'mm',
    'in',
    'pt',
    'pc',
    'ch'
  ];
  const parts = result.match(/[a-zA-Z]+|[0-9]+/g);
  const value = parts[0];
  const unit = parts[parts.length - 1];
  if (cssUnits.indexOf(unit) !== -1) {
    result = new sassUtils.SassDimension(parseInt(value, 10), unit);
  }

  return result;
};

module.exports = (env = {}, argv) => {
  const isProduction = argv.mode === 'production';

  let config = {
    context: path.resolve(__dirname, 'src'),

    entry: {
      // vendor: ['./styles/vendor.scss', './scripts/vendor.js'],
      app: ['./scss/style.scss', './js/main.js']
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      filename: 'scripts/[name].js',
      crossOriginLoading: 'anonymous'
    },

    module: {
      rules: [
        {
          test: /\.((s[ac]|c)ss)$/,
          use: [
            {
              loader: plugins.extractCSS.loader,
              options: {
                publicPath: '../' // use relative path for everything in CSS
              }
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: !isProduction,
                plugins: () => [
                  require('autoprefixer')(),
                  ...(isProduction
                    ? [
                        require('cssnano')({
                          preset: [
                            'default',
                            {
                              minifySelectors: false
                            }
                          ]
                        })
                      ]
                    : [])
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
                sassOptions: {
                  fiber: require('fibers'),
                  outputStyle: 'expanded',
                  sourceMap: !isProduction
                },
                functions: {
                  'get($keys)': function(keys) {
                    keys = keys.getValue().split('.');
                    var result = sassVars;
                    var i;
                    for (i = 0; i < keys.length; i++) {
                      result = result[keys[i]];
                      // Convert to SassDimension if dimenssion
                      if (typeof result === 'string') {
                        result = convertStringToSassDimension(result);
                      } else if (typeof result === 'object') {
                        Object.keys(result).forEach(function(key) {
                          var value = result[key];
                          result[key] = convertStringToSassDimension(value);
                        });
                      }
                    }
                    result = sassUtils.castToSass(result);
                    return result;
                  }
                }
              }
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          exclude: /fonts/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]'
                // publicPath: '..' // use relative path
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                disable: !isProduction,
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                optipng: {
                  enabled: false
                },
                pngquant: {
                  quality: [0.65, 0.9],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false
                },
                webp: {
                  quality: 75
                }
              }
            }
          ]
        },
        {
          test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
          exclude: /images/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
                // publicPath: '../fonts/' // use relative path
              }
            }
          ]
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeComments: true,
              collapseWhitespace: true,
              removeScriptTypeAttributes: true,
              removeStyleTypeAttributes: true
            }
          }
        }
      ]
    },

    devServer: {
      contentBase: path.join(__dirname, 'src'),
      port: 8080,
      overlay: {
        warnings: true,
        errors: true
      },
      quiet: true
    },

    plugins: (() => {
      let common = [
        new plugins.extractCSS({
          filename: 'styles/[name].css'
        }),
        new plugins.html({
          template: 'index.html',
          filename: 'index.html',
          minify: {
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }),
        new plugins.html({
          template: './subPages/menu.html',
          filename: 'menu.html',
          minify: {
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }),
        new plugins.html({
          template: './subPages/our-philosophy.html',
          filename: 'our-philosophy.html',
          minify: {
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }),
        new plugins.html({
          template: './subPages/contact-us.html',
          filename: 'contact-us.html',
          minify: {
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }),
        new plugins.html({
          template: './subPages/meet-the-team.html',
          filename: 'meet-the-team.html',
          minify: {
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }),
        new plugins.progress({
          color: '#b3129d'
        }),
        new CopyPlugin([
          {
            from: './favicon.ico',
            to: './',
            force: true
          }
        ]),
        new CopyPlugin([
          {
            from: './asset-manifest.json',
            to: './',
            force: true
          }
        ]),
        new CopyPlugin([
          {
            from: './favicons/**/*',
            to: './',
            force: true
          }
        ])
      ];

      const production = [
        new plugins.clean(),
        new plugins.copy([
          {
            from: 'data/**/*.json',
            transform: content => {
              return minJSON(content.toString());
            }
          }
        ]),
        new plugins.sri({
          hashFuncNames: ['sha384'],
          enabled: true
        })
      ];

      const development = [
        new plugins.sync(
          {
            host: 'localhost',
            port: 9090,
            proxy: 'http://localhost:8080/'
          },
          {
            reload: false
          }
        )
      ];

      return isProduction
        ? common.concat(production)
        : common.concat(development);
    })(),

    devtool: (() => {
      return isProduction
        ? '' // 'hidden-source-map'
        : 'source-map';
    })(),

    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        '~': path.resolve(__dirname, 'src/scripts/')
      }
    },

    stats: 'errors-only'
  };

  return config;
};
