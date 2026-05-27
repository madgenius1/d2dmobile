const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.nickjuma.d2d.dev";
  }

  if (IS_PREVIEW) {
    return "com.nickjuma.d2d.preview";
  }

  return "com.nickjuma.d2d";
};

const getAppName = () => {
  if (IS_DEV) {
    return "d2d (Dev)";
  }

  if (IS_PREVIEW) {
    return "d2d (Preview)";
  }

  return "d2d";
};

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
});
