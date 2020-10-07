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
 * NOTE: rawData should be a firestore query result
 * @param {object} rawData
 */
export const normalizeData = (rawData) => {
  if (!rawData) return false;
  let data = null;

  if ('docs' in rawData) {
    data = [];

    // Many
    rawData.forEach((item) => {
      data.push({
        ...item.data(),
        key: item.id,
      });
    });
  } else {
    data = {};

    // Single
    data = {
      ...rawData.data(),
      key: rawData.id,
    };
  }

  return data;
};

/**
 * isObjectEmpty
 *
 * @param {object} obj
 */
export const isObjectEmpty = (obj) => Object.keys(obj).length === 0;

/**
 * breakpoint.
 */
export const breakpoint = () => {
  if (window.innerWidth >= 375) {
    return 'mobile';
  }

  if (window.innerWidth >= 768) {
    return 'tablet-p';
  }

  return 'tablet-p';
};

// export as collection of utils
export default {
  extractFileURL,
  objectToArray,
  normalizeData,
  isObjectEmpty,
  breakpoint,
};
