const { payout_error_code } = require("./../common/messages");
const { exceptions } = require("./../utils/exception");

//Comparing keys and headers

function compareKeys(k1, k2) {
  let len1 = k1.length;
  let len2 = k2.length;

  if (len1 !== len2) return false;
  let index = 0;
  for (let i = 0; i < k1.length; i++) {
    if (k2[index] === k1[i]) {
      index++;
    } else {
      return { success: false, key1: k1[i], key2: k2 };
    }
  }
  return { success: k2.length === index };
}

const ValidatePayoutHeaders = (json, headers) => {
  try {
    const key = Object.keys(json[0]);
    const result = compareKeys(key, headers);

    if (!result.success) {
      if (!result.key1 || !result.key2) {
        return new exceptions(
          false,
          payout_error_code.HEADERS,
          `Unable to process wrong in header input`,
          `It should be ${headers}`
        );
      } else {
        return new exceptions(
          false,
          payout_error_code.HEADERS,
          `Unable to process wrong in header input ${result.key1}`,
          `It should be ${result.key2}`
        );
      }
    }
    return { success: true };
  } catch (error) {
    if (error instanceof exceptions) {
      return error;
    }
  }
};

module.exports = ValidatePayoutHeaders;
