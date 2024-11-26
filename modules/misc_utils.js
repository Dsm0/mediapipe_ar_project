/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};

/**
 * Remaps a number from one range to another range using linear interpolation.
 * 
 * Example: remap a value from 0-100 to 0-1
 * (50).remap(0, 100, 0, 1) // returns 0.5
 *
 * @param {Number} inMin The lower boundary of the input range
 * @param {Number} inMax The upper boundary of the input range 
 * @param {Number} outMin The lower boundary of the output range
 * @param {Number} outMax The upper boundary of the output range
 * @returns A number linearly mapped from the input range to the output range
 * @type Number
 */
Number.prototype.remap = function (inMin, inMax, outMin, outMax) {
    return (this - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};