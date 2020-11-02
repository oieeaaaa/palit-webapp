/**
 * payload.
 */
export const payload = () => ({
  message: '',
  error: null,
});

/**
 * successPayload.
 *
 * @param {object} response
 * @param {object} newPayload
 */
export const successPayload = (response, newPayload = {}) => response
  .status(200)
  .send({
    ...payload(),
    ...newPayload,
  });

/**
 * errorPayload.
 *
 * @param {object} response
 * @param {object} newPayload
 */
export const errorPayload = (response, newPayload = {}) => response
  .status(400)
  .send({
    ...payload(),
    ...newPayload,
  });

export default {
  payload,
  successPayload,
  errorPayload,
};
