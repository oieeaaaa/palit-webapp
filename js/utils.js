/**
 * extractFileURL.
 * It should return a URL (string) of the argument file
 * @param {object} file
 */
export const extractFileURL = (file) => {
  if (!file) return false;

  return URL.createObjectURL(file);
};

/**
 * objectToArray.
 *
 * It should convert object to array
 * It should create a new property (key) to retain the property key/name
 * @param {object} data
 */
export const objectToArray = (data) => Object.keys(data).map((key) => ({
  ...data[key],
  key,
}));

/**
 * normalizeData.
 *
 * NOTE: rawData is a firestore query result
 * @param {object} rawData
 */
export const normalizeData = (rawData) => {
  if (rawData.size >= 2) {
    const data = [];

    rawData.forEach((item) => {
      data.push({
        ...item.data(),
        key: item.id,
      });
    });

    return data;
  }

  // for single data
  if (rawData.exists) {
    return {
      ...rawData.data(),
      key: rawData.id,
    };
  }

  return null;
};

// export as collection of utils
export default {
  extractFileURL,
  objectToArray,
  normalizeData,
};
