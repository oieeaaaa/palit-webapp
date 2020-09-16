/**
 * extractFileURL.
 * It should return a URL (string) of the argument file
 * @param {object} file
 */
export const extractFileURL = (file) => {
  if (!file) return false;

  return URL.createObjectURL(file);
};

export default {
  extractFileURL,
};
