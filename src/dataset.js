//! nuff/dataset - @author Federico Orru' - @license Artistic-2.0

import {assign, entries, isString, seemsPlainObject, encode, decode} from './utils';

const attrNames = {};
const propNames = {};

const cache = {};

let globalNs = '';

const fullName = (name, ns) =>
	ns.length ? ns + name.substring(0, 1).toUpperCase() + name.substring(1) : name;

const fixNs = (ns) =>
	ns.length && ns.charAt(ns.length - 1) === '-' ? ns.substring(0, ns.length - 1) : ns;

function getAttrName(name, ns) {
	name = fullName(name, ns);
	return (attrNames[name] =
		attrNames[name] || 'data-' + name.replace(/([A-Z])/g, '-$1').toLowerCase());
}

function getPropName(name, ns) {
	return (propNames[name] =
		propNames[name] ||
		name
			.substring(ns ? getAttrName(ns, '').length + 1 : 5)
			.replace(/-([a-z])/g, (all, letter) => letter.toUpperCase()));
}

function escape(value) {
	value = JSON.stringify([value]);
	return value.substring(2, 2 + value.length - 4);
}

/**
 * Dataset objects allow to do typical CRUD operations on an element's data attributes, with support
 * for a namespace
 *
 */
class Dataset {
	/**
	 * Creates an instance of Dataset
	 *
	 * @param {Element} element the element for which we are creating the instance
	 * @param {string} [ns] optional namespace. If specified, it will be put at the beginning of
	 * every class name set through this class. If not specified, a global one previously set will
	 * be used.
	 */
	constructor(element, ns) {
		ns = ns === undefined ? globalNs : fixNs(ns);
		this.element = element;
		this.ns = ns;
	}

	/**
	 * Gives true if the data attribute with the given name (after applying an eventual namespace)
	 * exists on the element
	 *
	 * @param {string} name the name of the attribute. It accept names expressed also in
	 * camelCase, it will internally be converted to proper data attribute name.
	 * @returns {boolean}
	 */
	has(name) {
		return this.element.hasAttribute(getAttrName(name, this.ns));
	}

	/**
	 * Retrieve a data attribute value or all of them as long as they match the previously set
	 * namespace. Returned values are casted to the proper type among boolean, numbers, array and
	 * object (when they are encoded as JSON)
	 *
	 * @param {(string|object)} [name] When a string value is passed, it returns the the value of
	 * that attribute after applying the namespace. Name passed in camelCase are supported. If the
	 * attribute is not set it returns the eventual fallbackValue passed as a second parameter, or
	 * null otherwise. When no value is passed, it returns all data attributes values that match
	 * with the set namespace. When a plain object is passed, it is used as a set of default values:
	 * in will return all the values that match the namespace when they are available or the given
	 * default values
	 * @param {*} [fallbackValue] When a string name is passed and that attribute is not present,
	 * this fallbackValue will be returned
	 * @returns {(string|number|boolean|Array|object|null)} the retrieved value or values after
	 * casting them in the proper type or the fallbackValue
	 */
	get(name, fallbackValue) {
		const c = this.constructor;
		if (isString(name) && name.length) {
			return c.decode(this.getString(name, fallbackValue));
		}
		const values = this.getString();
		for (const [key, value] of entries(values)) {
			values[key] = c.decode(value);
		}
		return seemsPlainObject(name) ? assign({}, name, values) : values;
	}

	/**
	 * Exactly like the [get() method]{@link Dataset#get}, but without casting the value types, they
	 * will be returned as string
	 *
	 * @param {(string|object)} [name] @see [get() method]{@link Dataset#get}
	 * @param {*} [fallbackValue] [get() method]{@link Dataset#get}
	 * @returns {(string|object|null)} the retrieved value or values as strings
	 * or the fallbackValue.
	 */
	getString(name, fallbackValue) {
		if (isString(name) && name.length) {
			let value = this.element.getAttribute(getAttrName(name, this.ns));
			if (value === null && fallbackValue !== undefined) {
				value = fallbackValue;
			}
			return value;
		}
		const prefix = 'data-' + this.ns;
		const values = [...this.element.attributes].reduce((obj, attr) => {
			if (attr.name.indexOf(prefix) === 0) {
				obj[getPropName(attr.name, this.ns)] = attr.value;
			}
			return obj;
		}, {});
		return seemsPlainObject(name) ? assign({}, name, values) : values;
	}

	/**
	 * Sets one or more data attributes values, after applying the namespace to their name. Plain
	 * objects and arrays are stored in their JSON representation
	 *
	 * @param {(string|object)} name the name of the data attribute to be set or a plain object
	 * containing multiple name-value entries to be set. The names can be expressed in camelCase and
	 * the eventual namespace will be added before setting them
	 * @param {?(string|number|boolean|Array|object|null)} [value] The value to be set when the name is
	 * a string
	 */
	set(name, value) {
		const setOne = (n, v) => {
			n = getAttrName(n, this.ns);
			if (v !== undefined && v !== null) {
				this.element.setAttribute(n, this.constructor.encode(v));
			} else {
				this.element.removeAttribute(n);
			}
		};

		if (isString(name)) {
			setOne(name, value);
		} else {
			entries(name).map(([attr, val]) => setOne(attr, val));
		}
	}

	/**
	 * Remove a data attribute, after applying the eventual namespace to the name
	 *
	 * @param {string} name the name of the attribute to be removed. Can be expressed in camelCase
	 * format.
	 */
	remove(name) {
		this.element.removeAttribute(getAttrName(name, this.ns));
	}

	/**
	 * Cast values to strings. Used before storing the values in the data attributes
	 *
	 * @static
	 * @param {(string|number|boolean|Array|object|null)} value the value to be cast
	 * @returns {string} the string representation of the given value
	 */
	static encode(value) {
		return String(encode(value));
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
 * Returns a Dataset object for a given element and namespace, using a cache to avoid unnecessary
 * object creation (when called with the same element and namespace, it will always return the same
 * object)
 *
 * @param {Element} element the element for which we are creating the instance
 * @param {string} [ns] optional namespace. If specified, it will be put at the beginning of every
 * data attribute name set through the class. If not specified, a global one previously set will be
 * used.
 * @returns {Dataset} a Dataset object for the given element and namespace
 */
function dataset(element, ns) {
	ns = ns === undefined ? globalNs : fixNs(ns);

	if (!(ns in cache)) {
		cache[ns] = new WeakMap();
	}
	let ds = cache[ns].get(element);
	if (!ds) {
		ds = new Dataset(element, ns);
		cache[ns].set(element, ds);
	}
	return ds;
}

/**
 * Gets the global namespace
 *
 * @returns {string}
 * @memberof dataset
 */
dataset.getNs = () => globalNs;

/**
 * Sets the global namespace
 *
 * @param {string} value the new namespace
 * @memberof dataset
 */
dataset.setNs = (value) => {
	globalNs = fixNs(value);
};

/**
 * Returns a CSS selector in the form [data-ns-name] or [data-ns-name="value"] for the given
 * attribute name and value, taking into account the namespace.
 *
 * @param {string} name data attribute name for the selector. It accepts also names in camelCase
 * @param {?(string|number|boolean|Array|object|null)} [value] the optional value to be used in
 * the selector, to generate a form . It gets converted to string
 * @param {string} [ns] optional namespace. If specified, it will be put at the beginning of the
 * data attribute name class name. If not specified, a global one previously set will be used.
 * @returns {string} the generated CSS selector
 * @memberof dataset
 */
dataset.selector = (name, value, ns) => {
	ns = ns === undefined ? globalNs : fixNs(ns);
	return (
		'[' +
		getAttrName(name, ns) +
		(value !== undefined ? '="' + escape(Dataset.encode(value)) + '"' : '') +
		']'
	);
};

/**
 * Returns a data attribute name for the given name, taking into account the namespace.
 *
 * @param {string} name accepts also names in camelCase
 * @param {?(string|number|boolean|Array|object|null)} [value] the optional value to be used in
 * the selector, to generate a form . It gets converted to string.
 * @param {string} [ns] optional namespace. If specified, it will be put at the beginning of the
 * data attribute name. If not specified, a global one previously set will be used.
 * @returns {string} the generated attribute name in the form data-ns-name
 * @memberof dataset
 */
dataset.attrName = (name, ns) => {
	return getAttrName(name, ns === undefined ? globalNs : fixNs(ns));
};

export {dataset, Dataset};
