const createBaseConfig = require('@open-wc/testing-karma/create-karma-es5.config')

module.exports = (config) => {
  const baseConfig = createBaseConfig(config)

  config.set({
    ...baseConfig,

    files: [
      ...baseConfig.files,
      // if --grep flag is set, run those tests instead
      config.grep ? config.grep : 'test/**/*.test.js'
    ]
  })

  delete config.coverageIstanbulReporter.thresholds
}