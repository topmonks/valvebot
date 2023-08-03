export function getEnvValue<T>(name: string, defaultValue?: T) {
  const v = process.env[name] as T | undefined;

  if (!v) {
    if (defaultValue) {
      return defaultValue;
    } else {
      throw new Error("undefined environment variable " + name);
    }
  } else {
    return v;
  }
}
