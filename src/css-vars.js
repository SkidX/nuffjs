//! nuff / cssVars - @author Federico Orru' - @license Artistic License 2.0

import {encode, decode, isString, entries} from './utils';

const varNames = {};
const cache = {};

const getVarName = (name) => (varNames[name] = varNames[name] || (name.indexOf('--') === 0 ? name : '--' + name));

/**
 * CssVars objects allow to read / write CSS variables (custom properties) for the given element
 * (and eventual pseudo-element)
 *
 */
class CssVars {
	/**
	 * Creates an instance of CssVars.
	 *
	 * @param {Element} element the element for which we are creating the instance
	 * @param {?string} [pseudoElement] the optional pseudo-element. Examples: ':before',
	 * ':after', ':marker'
	 */
	constructor(element, pseudoElement) {
		this.element = element;
		this.pseudoElement = pseudoElement;
		this.computedStyle = getComputedStyle(element, pseudoElement);
		this.style = element.style;
	}

	/**
	 * Checkes if the given variable name has been set for the given element. A variable is
	 * considered to be set when the value is different from an empty string
	 *
	 * @param {string} name the name of the variable to be checked. It does not require the '--'
	 * at the beginning.
	 * @returns {boolean}
	 */
	has(name) {
		return this.fetch(name) !== '';
	}

	/**
	 * Gets the value of a variable (cast to a suitable standard type) or the given fallbackValue
	 * (or an empty string) when the variable is not set
	 *
	 * @param {string} name the name of the variable to be read. It does not require the '--' at
	 * the beginning.
	 * @param {?(string|number|boolean|Array|object|null)} [fallbackValue] when the variable is
	 * not set this fallbackValue will be returned
	 * @returns {(string|number|boolean|Array|object|null)} the variable value or the fallbackValue
	 * or an empty string when the variable is not set
	 */
	get(name, fallbackValue) {
		return this.constructor.decode(this.getString(name, fallbackValue));
	}

	/**
	 * Exactly like the [get() method]{@link CssVars#get}, but without casting the value type, it
	 * will be returned as string
	 *
	 * @param {string} name the name of the variable to be read. It does not require the '--' at
	 * the beginning.
	 * @param {?string} [fallbackValue] when the variable is not set this fallbackValue will be
	 * returned
	 * @returns {string} the variable value as a string or the fallbackValue or an empty string when
	 * the variable is not set
	 */
	getString(name, fallbackValue) {
		let value = this.fetch(name);
		if (value === '' && fallbackValue !== undefined) {
			value = fallbackValue;
		}
		return value;
	}

	/**
	 * Sets one or more CSS variables. Plain objects and arrays are stored in their JSON
	 * representation
	 *
	 * @param {(string|object)} name the name of the variable to be set or a plain object
	 * containing multiple name-value entries to be set. The names can be expressed without the
	 * '--', it will be added automatically.
	 * @param {?(string|number|boolean|Array|object|null)} [value] The value to be set when the
	 * name is a string
	 */
	set(name, value) {
		const setOne = (n, v) => this.style.setProperty(getVarName(n), this.constructor.encode(v));
		if (isString(name)) {
			setOne(name, value);
		} else {
			entries(name).map(([varName, val]) => setOne(varName, val));
		}
	}

	/**
	 * Removes a variable previously set with JS or in the inline style attribute. It cannot remove
	 * a variable set by a separated CSS file or by a <style> element.
	 *
	 * @param {string} name the name of the variable to be removed. It does not require the '--'
	 * at the beginning.
	 */
	remove(name) {
		this.style.removeProperty(getVarName(name));
	}

	/**
	 * Internal method to retrieve the variable value. When the element is connected to a document
	 * or a pseudo-element is specified, it tries to use the the element's computed style, otherwise
	 * it fallbacks to the element's style object. It automatically removes leading and trailing
	 * single and double quote chars for values that were expressed in that way.
	 *
	 * @private
	 *
	 * @param {string} name the name of the variable to be read. It does not require the '--'
	 * @returns {string} the variable value or an empty string when the variable is not found
	 */
	fetch(name) {
		return (this.element.isConnected || this.pseudoElement ? this.computedStyle : this.style)
			.getPropertyValue(getVarName(name))
			.trim()
			.replace(/^'(.*)'$/gi, '$1')
			.replace(/^"(.*)"$/gi, '$1');
	}

	/**
	 * Cast values to strings. Used before storing the values in the CSS variable
	 *
	 * @static
	 * @param {(string|number|boolean|Array|object|null)} value the value to be cast
	 * @returns {string} the string representation of the given value
	 */
	static encode(value) {
		return encode(value);
	}

	/**
	 * Try to cast a value expressed as string to a more suitable standard type
	 *
	 * @static
	 * @param {string} value the string value to be converted
	 * @returns {(string|number|boolean|Array|object|null)} The value after the cast
	 */
	static decode(value) {
		return decode(value);
	}
}

/**
 * Returns a CssVars object for a given element and optional pseudo-element, using a cache to avoid
 * unnecessary object creation (when called with the same element and pseudo-element, it will always
 * return the same object)
 *
 * @param {Element} element the element for which we are creating the instance
 * @param {?string} [pseudoElement] the optional pseudo-element. Examples: ':before', ':after',
 * ':marker'
 * @returns {CssVars} a CssVars object for the given element and pseudo-element
 */
function cssVars(element, pseudoElement = null) {
	const pseudo = pseudoElement === null ? '' : pseudoElement;
	if (!(pseudo in cache)) {
		cache[pseudo] = new WeakMap();
	}
	let entry = cache[pseudo].get(element);
	if (!entry) {
		entry = new CssVars(element, pseudoElement);
		cache[pseudo].set(element, entry);
	}
	return entry;
}

export {cssVars, CssVars};
