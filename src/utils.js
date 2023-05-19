const isArray = Array.isArray;

const isString = (value) => typeof value === 'string' || Object.prototype.toString.call(value) === '[object String]';

const keys = Object.keys;
const entries = Object.entries;
const values = Object.values;
const assign = Object.assign;

const seemsPlainObject = (value) => typeof value === 'object' && !!value && !(value instanceof Function) && value.constructor === Object;

/**
 * Very simple throttle function, based on one proposed here:
 * https://stackoverflow.com/a/27078401
 *
 * @private
 *
 * @param {function} callback - the function to be throttled
 * @param {boolean|number} interval - when is true, it uses requestAnimationFrame, otherwise a timeout of <interval> milliseconds
 * @returns {function} the throttled function
 */
function throttle(callback, interval) {
	let pending = false;
	let late = null;
	const f = (...args) => {
		if (!pending) {
			callback.apply(this, args);
			pending = true;
			const reset = () => {
				pending = false;
				if (late) {
					const c = late;
					late = null;
					c();
				}
			};
			if (interval === true) {
				requestAnimationFrame(reset);
			} else {
				setTimeout(reset, interval);
			}
		} else {
			late = () => f.apply(this, args);
		}
	};
	return f;
}

/**
 * Cast basic type values to strings.
 *
 * @private
 *
 * @param {(string|number|boolean|Array|object|null)} value - the value to be cast
 * @returns {string} - the string representation of the given value
 */
function encode(value) {
	if (value === true) {
		return 'true';
	}
	if (value === false) {
		return 'false';
	}
	if (value === null) {
		return 'null';
	}
	if (Array.isArray(value) || (typeof value === 'object' && !!value)) {
		value = String(JSON.stringify(value));
	}
	return value;
}

/**
 * Try to cast a value expressed as string to a more suitable standard type. Inspired by old jquery
 * data attribute parsing
 *
 * @private
 *
 * @param {string} value - the string value to be converted
 * @returns {(string|number|boolean|Array|object|null)} - The value after the cast
 */
function decode(value) {
	if (value === 'true') {
		return true;
	}
	if (value === 'false') {
		return false;
	}
	if (value === 'null') {
		return null;
	}
	try {
		// Only convert to a number if it doesn't change the string
		if (+value + '' === value) {
			return +value;
		}
		if (/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(value)) {
			return JSON.parse(value);
		}
		return value;
	} catch (e) {
		return value;
	}
}

export {isArray, isString, keys, entries, values, assign, seemsPlainObject, throttle, encode, decode};
