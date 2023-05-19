//! nuff/classlist - @author Federico Orru' - @license Artistic-2.0

const cache = {};

let globalNs = '';

const mapNs = (classes, ns) => classes.map((name) => ns + name);

/**
 * It provides methods for manipulating and accessing the classList of an Element, with support for
 * namespaces. API almost completely equivalent to Element.classList.
 *
 * @see [DOMTokenList]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList}
 *
 */
class ClassList {
	/**
	 * Creates an instance of ClassList.
	 *
	 * @param {Element} element the element for which we are creating the instance
	 * @param {string} [ns] optional namespace. If specified, it will be put at the beginning of
	 * every class name set through this class. If not specified, a global one previously set will
	 * be used.
	 */
	constructor(element, ns) {
		ns = ns === undefined ? globalNs : ns;
		this.element = element;
		this.ns = ns;
		this.cl = element.classList;
	}

	/**
	 * Getter equivalent to Element.classList.length, but taking the namespace into account. Gets
	 * the number of class names that start with the specified namespace.
	 * @see [DOMTokenList:
	 * length]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/length}
	 *
	 * @readonly
	 * @type {number}
	 */
	get length() {
		return this.values().length;
	}

	/**
	 * Getter / Setter equivalent to Element.classList.value, but taking the namespace into account.
	 * @see [DOMTokenList:
	 * value]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/value}
	 *
	 * @type {string}
	 * @memberof ClassList
	 */
	get value() {
		return this.values().join(' ');
	}

	set value(classes) {
		this.cl.value = mapNs(classes.split(/\s+/g), this.ns).join(' ');
	}

	/**
	 * Equivalent to Element.classList.add(), but taking the namespace into account.
	 * @see [DOMTokenList:
	 * add()]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/add}
	 *
	 * @example <caption>Adding classes</caption>
	 * ``` javascript
	 * import {classList} from 'nuff';
	 * classList.cs = 'acme-';
	 * const element = document.createElement('div');
	 * const cs = classList(element);
	 * cs.add('test'); // adds 'acme-test'
	 * cs.add('one', 'two', 'three'); // adds 'acme-one', 'acme-two', 'acme-three'
	 * ```
	 *
	 * @param {...string} classes one or more class names
	 */
	add(...classes) {
		this.cl.add(...mapNs(classes, this.ns));
	}

	/**
	 * Equivalent to Element.classList.remove(), but taking the namespace into account.
	 * @see [DOMTokenList:
	 * remove()]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/remove}
	 *
	 * @param {...string} classes one or more class names
	 */
	remove(...classes) {
		this.cl.remove(...mapNs(classes, this.ns));
	}

	/**
	 * Equivalent to Element.classList.contains(), but taking the namespace into account.
	 * @see [DOMTokenList:
	 * contains()]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/contains}
	 *
	 * @param {string} name the class name to check
	 * @returns {boolean} true if the given class name is set on the element, false otherwise
	 */
	contains(name) {
		return this.cl.contains(this.ns + name);
	}

	/**
	 * Equivalent to Element.classList.toggle(), but taking the namespace into account.
	 * @see [DOMTokenList:
	 * toggle()]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle}
	 *
	 * @param {string} name the class name to be toggled
	 * @param {boolean} [force] a flag to force the add or remove of the class name
	 * @returns {boolean} true when the class name is present after the call, false otherwise
	 */
	toggle(name, force) {
		return this.cl.toggle(this.ns + name, force);
	}

	/**
	 * Equivalent to Element.classList.replace(), but taking the namespace into account.
	 * @see [DOMTokenList:
	 * replace()]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace}
	 *
	 * @param {string} oldClass the class name to be replaced
	 * @param {string} newClass the class name replacement
	 * @returns {boolean} true if oldToken was successfully replaced, or false if not.
	 */
	replace(oldClass, newClass) {
		return this.cl.replace(this.ns + oldClass, this.ns + newClass);
	}

	/**
	 * Equivalent to Element.classList.values(), but taking the namespace into account.
	 * @see [DOMTokenList:
	 * values()]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/values}
	 *
	 * @returns {array} the iterable array of class names that match with the namespace
	 */
	values() {
		return [...this.cl.values()]
			.filter(
				(name) => !this.ns.length || (name.length > this.ns.length && name.indexOf(this.ns) === 0)
			)
			.map((name) => name.substring(this.ns.length));
	}

	/**
	 * Equivalent to Element.classList.keys(), but taking the namespace into account.
	 * @see [DOMTokenList:
	 * keys()]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/keys}
	 *
	 * @returns {array} the list of indexes, based on the class names list that match with the
	 * namespace
	 */
	keys() {
		return this.values().map((name, index) => index);
	}

	/**
	 * Equivalent to Element.classList.entries(), but taking the namespace into account.
	 * @see [DOMTokenList:
	 * entries()]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/entries}
	 *
	 * @returns {array} the iterable list of [index, class name] built with class names that match
	 * the namespace
	 */
	entries() {
		return this.values().map((name, index) => [index, name]);
	}

	/**
	 * Equivalent to Element.classList.item(), but taking the namespace into account.
	 * @see [DOMTokenList:
	 * item()]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/item}
	 *
	 * @param {number} index the index of the class name, taking into account only those that
	 * match with the namespace
	 * @returns {?string} the class name at the specified index or null when the index is out of
	 * range
	 */
	item(index) {
		const values = this.values();
		return index >= 0 && index < values.length ? values[index] : null;
	}

	/**
	 * Equivalent to Element.classList.forEach(), but taking the namespace into account.
	 * @see [DOMTokenList:
	 * forEach()]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/forEach}
	 *
	 * @param {Function} callback The function to execute for each element
	 * @param {object} [context] The value to use as *this* when executing callback
	 */
	forEach(callback, context) {
		context = context || window;
		const values = this.values();
		values.map((name, i) => callback.call(context, name, i, values));
	}
}

/**
 * Returns a ClassList object for a given element and namespace, using a cache to avoid unnecessary
 * object creation (when called with the same element and namespace, it will always return the same
 * object).
 *
 * @param {Element} element the element for which we are creating the instance
 * @param {string} [ns] optional namespace. If specified, it will be put at the beginning of
 * every class name set through the class. If not specified, a global one previously set will
 * be used.
 * @returns {ClassList} a ClassList object for the given element and namespace
 */
function classList(element, ns) {
	ns = ns === undefined ? globalNs : ns;
	if (!(ns in cache)) {
		cache[ns] = new WeakMap();
	}
	let cs = cache[ns].get(element);
	if (!cs) {
		cs = new ClassList(element, ns);
		cache[ns].set(element, cs);
	}
	return cs;
}

/**
 * Gets the global namespace
 *
 * @returns {string}
 * @memberof classList
 */
classList.getNs = () => globalNs;

/**
 * Sets the global namespace
 *
 * @param {string} value the new namespace
 * @memberof classList
 */
classList.setNs = (value) => {
	globalNs = String(value);
};

/**
 * Returns a CSS selector for the given class names, adding the namespace to them
 *
 * @param {(string|Array)} name class name or array of class names
 * @param {string} [ns] optional namespace. If specified, it will be put at the beginning of every
 * class name. If not specified, a global one previously set will be used.
 * @returns {string} the generated CSS selector
 * @memberof classList
 */
classList.selector = (name, ns) => {
	ns = ns === undefined ? globalNs : ns;
	return (Array.isArray(name) ? name : name.split(/\s+/g)).map((n) => '.' + ns + n).join('');
};

/**
 * Returns a class name after adding the namespace to it.
 *
 * @param {string} name class name
 * @param {string} [ns] optional namespace. If specified, it will be put at the beginning of the
 * class name. If not specified, a global one previously set will be used.
 * @returns {string} the class name starting with the namespace
 * @memberof classList
 */
classList.className = (name, ns) => {
	ns = ns === undefined ? globalNs : ns;
	return ns + name;
};

export {classList, ClassList};
