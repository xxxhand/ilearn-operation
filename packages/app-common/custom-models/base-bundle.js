/* eslint-disable no-prototype-builtins */
/**
 * @class
 * @description Represents a base request
 */
class BaseBundle {
  /**
   * @method
   * @description Binding incoming parameters to target object
   * @param {object} source - Incoming request parameters
   * @param {object} target -target object to be binded
   * @returns {void}   void
   */
  bind(source = {}, target = {}) {
    const sourceKeys = Object.keys(source);
    for (const k of sourceKeys) {
      if (target.hasOwnProperty(k)) {
        target[k] = source[k];
      }
    }
  }
}

module.exports = BaseBundle;
