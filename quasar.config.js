module.exports = function (/* ctx */) {
  return {
    eslint: {
      fix: true,
      warnings: true,
      errors: true,
      cache: false,
      include: [
        'src/**/*.js',
        'src/**/*.vue',
        'quasar.config.js'
      ]
    },
    boot: [
      'axios',
      'pinia'
    ],
    css: [
      'app.scss'
    ],
    extras: [
      'roboto-font',
      'material-icons'
    ],
    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16'
      },
      vueRouterMode: 'history'
    },
    devServer: {
      open: true
    },
    framework: {
      config: {
        dark: 'auto'
      },
      plugins: [
        'Notify',
        'Loading',
        'Dialog'
      ]
    },
    animations: 'all'
  }
} 