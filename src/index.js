import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default class HandleCSSLoader {
  constructor({
    fallbackLoader = 'style-loader',
    cssLoader = 'css-loader',
    postcss,
    sourceMap,
    extract,
    minimize,
    cssModules
  } = {}) {
    this.fallbackLoader = fallbackLoader
    this.cssLoader = cssLoader
    this.postcssOptions = postcss
    this.sourceMap = sourceMap
    this.extract = extract
    this.minimize = minimize
    this.cssModules = cssModules
  }

  getLoader(test, loader, options = {}) {
    const cssLoaderOptions = {
      autoprefixer: false,
      sourceMap: this.sourceMap,
      minimize: this.minimize
    }

    if (this.cssModules) {
      cssLoaderOptions.modules = true
      cssLoaderOptions.importLoaders = 1
      cssLoaderOptions.localIdentName = '[name]_[local]__[hash:base64:5]'
    }

    if (loader === 'css-loader') {
      Object.assign(cssLoaderOptions, options)
    }

    const use = [{
      loader: this.cssLoader,
      options: cssLoaderOptions
    }]

    if (loader !== 'postcss-loader' && this.postcssOptions !== false) {
      use.push({
        loader: 'postcss-loader',
        options: {
          ...this.postcssOptions,
          sourceMap: this.sourceMap
        }
      })
    }

    if (loader && loader !== 'css-loader') {
      use.push({
        loader,
        options: {
          ...options,
          sourceMap: this.sourceMap
        }
      })
    }

    return {
      test,
      use: this.extract ? ExtractTextPlugin.extract({
        use,
        fallback: this.fallbackLoader
      }) : use
    }
  }

  css(options) {
    return this.getLoader(/\.css$/, 'css-loader', options)
  }

  sass(options = {}) {
    return this.getLoader(/\.sass$/, 'sass-loader', {
      indentedSyntax: true,
      ...options
    })
  }

  scss(options) {
    return this.getLoader(/\.scss$/, 'sass-loader', options)
  }

  less(options) {
    return this.getLoader(/\.less$/, 'less-loader', options)
  }

  stylus(options) {
    return this.getLoader(/\.stylus$/, 'stylue-loader', options)
  }

  styl(options) {
    return this.getLoader(/\.styl$/, 'stylue-loader', options)
  }
}
