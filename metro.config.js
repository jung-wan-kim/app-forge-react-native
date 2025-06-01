const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      // Skip the problematic DebuggingOverlayNativeComponent
      if (moduleName.includes('DebuggingOverlayNativeComponent')) {
        return {
          filePath: __dirname + '/node_modules/react-native/Libraries/Components/View/View.js',
          type: 'sourceFile',
        };
      }
      
      // Default resolver
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);