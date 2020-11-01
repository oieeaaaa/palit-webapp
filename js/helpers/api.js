/**
 * api.
 *
 * @param {object} methods: GET | POST | PUT | DELETE
   * Example:
   ```
    const myGetMethod = (req, res) => ...some codes here
    const myPostMethod = (req, res) => ...some codes here

    // use it like this
    const myApi = api({
      get: myGetMethod,
      post: myPostMethod
    });
   ```
 */
const api = (methods) => async (req, res) => {
  for (const method of Object.keys(methods)) {
    if (req.method === method.toUpperCase()) {
      await methods[method](req, res);
    } else {
      throw new Error('Invalid method name: Try using 👉 get, post, put, or delete.');
    }
  }
};

export default api;
