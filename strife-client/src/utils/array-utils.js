/**
 * Performs a deep comparison on two arrays of objects
 * @param {array} arr1
 * @param {array} arr2
 * @returns {Boolean}
 */
export function deepCompare(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  arr1.forEach((el, index) => {
    const json1 = JSON.stringify(el);
    const json2 = JSON.stringify(arr2[index]);
    if (json1 !== json2) {
      return false;
    }
  });
  return true;
}
