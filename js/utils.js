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
 * isAllObjectValuesFalse.
 *
 * @param {object} obj
 */
export const isAllObjectValuesFalse = (obj) => !Object.keys(obj).some((key) => !!obj[key]);

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

/**
 * validate.
 * You can add more rules here if need be
 *
 * @param {any} value
 * @param {object} rules (complete, email, regexp)
 *
 *
 * Example:
 * ```
 *  validate('something.aaa @ gmail.com', { complete: true, email: true })
 *
 *  // Result: { isInvalid: true, invalidRules: ['email'] }
 * ```
 */
export const validate = (value, rules = {}) => {
  // Add your rules here
  const RULES = {
    COMPLETE: 'complete',
    EMAIL: 'email',
    REGEXP: 'regexp',
  };

  const validated = {
    isInvalid: false,
    invalidRules: [],
  };

  for (const ruleKey in rules) { // eslint-disable-line
    const ruleVal = rules[ruleKey];

    if (!ruleVal) return validated;

    switch (ruleKey) {
      case RULES.COMPLETE: {
        if (!value) {
          validated.invalidRules = validated.invalidRules.concat(ruleKey);
        }

        break;
      }

      case RULES.EMAIL: {
        const emailRegExp = /.[^\s]*@[^\s]*\..\w+/g; // not sure about dis, ask joimee

        if (!emailRegExp.test(value)) {
          validated.invalidRules = validated.invalidRules.concat(ruleKey);
        }

        break;
      }

      case RULES.REGEXP: {
        if (!ruleVal.test(value)) {
          validated.invalidRules = validated.invalidRules.concat(ruleKey);
        }

        break;
      }

      // ADD YOUR RULES CONDITION HERE
      // >>>>>  <<<<
      // ADD YOUR RULES CONDITION HERE

      default: throw new Error('Invalid rule property!');
    }
  }

  validated.isInvalid = !!validated.invalidRules.length;

  return validated;
};

/**
 * validateFields.
 *
 * @param {object} fields
 * @param {ojbect} validators
 *
 * Example:
 * ```
 *  validateFields({
 *    name: 'John Doe',
 *    email: '', // invalid
 *  }, {
 *    name: {
 *      complete: true,
 *    },
 *    email: {
 *      complete: true,
 *      email: true,
 *    },
 *  });
 *
 *  // Result:
 *    {
 *      invalidFields: [{
 *        isInvalid: true,
 *        invalidRules: ['name', 'email'],
 *        key: 'email',
 *      }],
 *      isInvalid: true,
 *    }
 * ```
 */
export const validateFields = (fields, fieldRules) => {
  const validatedFields = {
    isInvalid: false,
    invalidFields: [],
  };

  for (const fieldKey in fields) { // eslint-disable-line
    const validatedField = validate(fields[fieldKey], fieldRules[fieldKey]);

    // This field is invalid ❌
    if (validatedField.isInvalid && !validatedFields.isInvalid) {
      validatedFields.isInvalid = true;
    }

    validatedFields.invalidFields = validatedFields.invalidFields.concat({
      ...validatedField,
      key: fieldKey,
    });
  }

  return validatedFields;
};

/**
 * isEqual
 * This will perform a shallow comparison
 *
 * @param {object} data
 * @param {object} toCompare
 */
export const isEqual = (data = {}, toCompare = {}) => !Object.keys(data)
  .some((key) => data[key] !== toCompare[key]);

// export as collection of utils
export default {
  extractFileURL,
  objectToArray,
  normalizeData,
  isObjectEmpty,
  breakpoint,
  validate,
  validateFields,
  isEqual,
  isAllObjectValuesFalse,
};
