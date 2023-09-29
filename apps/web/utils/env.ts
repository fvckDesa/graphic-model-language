export const env = new Proxy(process.env as Record<string, string>, {
  get(env, key): string {
    if (typeof key === "symbol") {
      throw new Error("Symbol is not valid key");
    }

    const value = env[key];

    if (value == undefined) {
      throw new Error(`Env '${key}' not found`);
    }

    return value;
  },
});
