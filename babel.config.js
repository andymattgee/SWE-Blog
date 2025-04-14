module.exports = function (api) {
  // Cache the configuration based on the NODE_ENV environment variable
  api.cache.using(() => process.env.NODE_ENV);

  const presets = [
    "@babel/preset-env",
    "@babel/preset-react"
  ];

  const plugins = [];

  // Add react-refresh/babel plugin only in development mode
  if (process.env.NODE_ENV === 'development') {
    plugins.push("react-refresh/babel");
  }

  return {
    presets,
    plugins,
  };
};