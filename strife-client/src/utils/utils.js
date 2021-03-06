import _ from 'lodash';
/**
 * Performs a deep comparison on two arrays of objects
 * @param {array} arr1
 * @param {array} arr2
 * @returns {Boolean}
 */
export function deepCompare(arr1, arr2) {
  return _(arr1).xorWith(arr2, _.isEqual).isEmpty();
}

export function pickRandomElement(arr) {
  return _.sample(arr);
}

export function pickRandomBetweenRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
