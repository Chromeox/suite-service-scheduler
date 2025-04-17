const createExpoWebpackConfig = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfig(env, argv);
  
  // Add any custom webpack configurations here
  
  return config;
};
