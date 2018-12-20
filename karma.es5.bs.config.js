const createBaseConfig = require('@open-wc/testing-karma-bs/create-karma-es5-bs.config')

module.exports = (config) => {
  const baseConfig = createBaseConfig(config)

  config.set({
    ...baseConfig,

    files: [
      ...baseConfig.files,
      // if --grep flag is set, run those tests instead
      config.grep ? config.grep : 'test/**/*.test.js'
    ],

    browserStack: {
      ...baseConfig.browserStack,
      project: 'ld-navigation'
    }
  })

  delete config.coverageIstanbulReporter.thresholds
}
