const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    alias: {
      '@': './src',
      '@components': './src/components',
      '@screens': './src/screens',
      '@services': './src/services',
      '@utils': './src/utils',
      '@types': './src/types',
      '@constants': './src/constants',
      '@hooks': './src/hooks',
      '@store': './src/store',
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
