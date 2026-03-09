export default new Proxy(
  {},
  {
    get: (target, key) => key,
  }
);
