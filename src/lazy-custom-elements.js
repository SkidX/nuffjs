//! nuff/lazy-custom-elements - @author Federico Orru' - @license Artistic-2.0

import {assign, isArray, isString} from './utils';

const elementsConnectedOnce = new WeakSet();
const baseHtmlConstructors = {};

function getParentConstructor(tagName) {
	if (!(tagName in baseHtmlConstructors)) {
		baseHtmlConstructors[tagName] = document.createElement(tagName).constructor;
	}
	return baseHtmlConstructors[tagName];
}

const registry = window.customElements;

const defaultOptions = {
	lazyValue: 'lazy',
	autodefineRoot: document,
	autodefineRootMargin: '100% 0px 100% 0px',
	autodefineThreshold: 0,
	autodefineAttribute: 'data-autodefine',
	autodefineDefaultValue: 'lazy',
	autoloadRoot: document,
	autoloadRootMargin: '50% 0px 50% 0px',
	autoloadThreshold: 0,
	autoloadAttribute: 'data-autoload',
	loadMethod: 'load',
	firstConnectedCallbackMethod: 'firstConnectedCallback',
};

const defaultDefineOptions = {
	extends: null,
	selector: '',
};

/**
 * The LazyCustomElementRegistry class is a custom element registry for defining and upgrading
 * custom elements in a lazy manner.
 *
 */
class LazyCustomElementRegistry {
	/**
	 * Creates an instance of LazyCustomElementRegistry.
	 */
	constructor() {
		/** @private @type {?number} */
		this.checkTimeout = null;

		/** @private @type {WeakMap} */
		this.components = new WeakMap();

		/** @private @type {WeakMap} */
		this.observers = new WeakMap();

		/** @private @type {Map} */
		this.entries = new Map();

		/** @private @type {string} */
		this.selectors = '';

		/** @private @type {Set} */
		this.selectorsSet = new Set();

		/** @private @type {?MutationObserver} */
		this.domObserver = null;

		/** @private @type {object} */
		this.options = assign({}, defaultOptions);
	}

	/**
	 * Equivalent of customElements.define() but supporting async definition and additional
	 * features. Define a custom element or custom built-in element, potentially in a lazy way, by
	 * passing an async callback that resolve to the Class
	 *
	 * @param {string} name The name of the custom element being defined, or a partial name ending
	 * with a dash in case of late definition of custom built-in elements classes from a mixin, see
	 * options.extends description.
	 * @param {Function} constructor The constructor function or class for the custom element
	 * being defined, or an async function that will resolve to the constructor. For
	 * @param {object} [options={}] An optional object containing configuration options for the
	 * custom element being defined. It may override some of the global options.
	 * @param {(string|Array)} [options.extends] the tagName of the built-in element to be
	 * extended. It allows to specify an array of names or the string '*' supporting the late
	 * definition of the class from a mixin in the form: const ClassName = (Base) => class extends
	 * Base {}. In that case the element name needs to be defined in a partial form with a trailing
	 * dash like 'acme-my-element-'. The final name of the elements will be completed adding the
	 * built-in element name that are going to be extended, like: 'acme-my-element-button',
	 * 'acme-my-element-a' and so on.
	 * @param {string} [options.selector] an alternative selector to identify custom elements
	 * in the dom in order to observe them for lazy defining and lazy loading. By default it will
	 * use the component name or a data attribute selector [is] for custom built-in elements
	 * @param {string} [options.autodefineAttribute=data-autodefine] attribute name (usually a data-attribute) to
	 * control the autodefinition behavior on the defined custom elements. Valid attribute values are 'true' (will be
	 * defined as soon as it is intercepted in the DOM), 'lazy' or an alternative value defined in options.lazyValue
	 * (will be defined when one element of this type intercepts a defined area around the viewport) or 'false' (will
	 * not be defined automatically, it will require an upgrade call to force the definition)
	 * @param {string} [options.lazyValue=lazy] value used to define the lazy behavior (both for autodefine and
	 * autoload features)
	 * @param {(Document|HTMLElement)} [options.autodefineRoot=document] root used for the autodefine
	 * IntersectionObserver
	 * @param {string} [options.autodefineRootMargin=100% 0px 100% 0px] margin used for the autodefine
	 * IntersectionObserver. By default it has a 100% height margin both above and below the viewport
	 * @param {number} [options.autodefineThreshold=0] threshold used for the autodefine IntersectionObserver
	 * @param {string} [options.autodefineDefaultValue=lazy] the default value for the autodefine attribute
	 * @param {(Document|HTMLElement)} [options.autoloadRoot=document] root used for the autoload IntersectionObserver
	 * @param {string} [options.autoloadRootMargin=50% 0px 50% 0px] margin used for the autoload
	 * IntersectionObserver. By default it has a 50% height margin both above and below the viewport
	 * @param {number} [options.autoloadThreshold=0] threshold used for the autodefine IntersectionObserver
	 * @param {string} [options.autoloadAttribute=data-autoload] attribute name (usually a data-attribute) to
	 * control the autoloading behavior on the defined custom elements. Valid attribute values are 'true' (will call the
	 * load method as soon as it is intercepted in the DOM), 'lazy', or an alternative value defined in
	 * options.lazyValue (will call the load method when the element is intercepted in a defined area around the
	 * viewport). Any other value will be ignored. Differently from the autodefine, elements that want to subscribe to
	 * the autoloading feature needs to have this attribute set.
	 * @param {string} [options.loadMethod=load] Name of the method to be called when the load is triggered
	 * @param {?(string|boolean)} [options.firstConnectedCallbackMethod=firstConnectedCallback] if the custom
	 * element class contains this method, it will be called only the first time the elements are connected to the
	 * document instead of the connectedCallback() method, which instead will be called (if available) on every
	 * reconnection after the first one. An empty string or a falsy value can be passed to disable the feature when the
	 * class contains such a method but you don't want to subscribe to this automated behavior.
	 *
	 * @returns {LazyCustomElementRegistry} return itself to allow for chain calls
	 */
	define(name, constructor, options = {}) {
		if (!(constructor instanceof Function)) {
			throw new Error('Constructor must be a class or function');
		}
		// for multiple custom built-in elements defined from the same base mixin, the name needs to
		// end with a dash
		const isMulti = name.substring(name.length - 1) === '-';
		if (isMulti) {
			if (!options.extends) {
				throw new Error('Invalid name ' + name + '  or missing extends option');
			}
			// when the multiple parent elements are defined as an array, we repeat the definition
			// internally for each of them definition for custom built-in elements that can extend
			// any html element passes '*' as options.extends value
			if (isArray(options.extends)) {
				for (const ext of options.extends) {
					this.define(name + ext, constructor, assign({}, options, {extends: ext}));
				}
				return this;
			}
		}
		// if the constructor class is passed directly in a sync way, we define the element
		// immediately as the standard CustomElementRegistry would do, otherwise we postpone the
		// definition in a lazy way to be performed only when needed
		const constructorOpts =
			constructor.prototype instanceof Element
				? {constructor: constructor}
				: {getConstructor: constructor, constructor: null};
		options = assign({}, defaultDefineOptions, options, constructorOpts);
		if (options.constructor && !isMulti) {
			constructor = this.prepareConstructor(constructor, options);
			options.constructor = constructor;
			registry.define(name, constructor, options.extends ? {extends: options.extends} : undefined);
		}

		let selector = options.selector;
		if (!selector) {
			// default selector for custom elements is their tagName. for custom built-in elements it
			// is an attribute selector
			selector = options.extends ? `[is${isMulti ? '^' : ''}="${name}"]` : name;
		}
		// we need a single selector (without duplicates) in order to match all the custom elements
		// together
		this.selectorsSet.add(selector);
		this.selectors = [...this.selectorsSet].join(',');

		this.entries.set(name, options);

		// after the definition we check the dom to find and observe already present elements. This
		// is done in an asynchronous way in order to not slow down in case of multiple definitions
		// in a row
		this.scheduleCheck();

		// this method is chainable to shorten multiple definitions
		return this;
	}

	/**
	 * Async version of CustomElementRegistry.get method. Retrieve a previously defined constructor
	 * for a given custom element name. It resolves late definitions made from a mixin in the form:
	 * const ClassName = (Base) => class extends Base {}. It also implements (through subclassing)
	 * the logic to deal with a firstConnectedCallback() method when the feature is enabled and the
	 * method is available in the defined constructor.
	 *
	 * @param {string} name the custom element or custom built-in element name associated to the
	 * constructor to retrieve
	 * @returns {Promise<(Function|undefined)>} resolves to a previously defined constructor or to
	 * undefined
	 */
	async get(name) {
		// when it is already registered in the original CustomElementRegistry there is nothing else to do
		let constructor = registry.get(name);
		if (constructor) {
			return constructor;
		}
		// when it was not defined, return undefined as the original CustomElementRegistry
		const entry = this.getEntry(name);
		if (!entry) {
			return undefined;
		}
		if (!entry.constructor) {
			// the constructor has not been resolved yet
			const getConstructor = entry.getConstructor;
			constructor = await getConstructor();
			constructor = this.prepareConstructor(constructor, entry);
			entry.constructor = constructor;
		}
		return entry.constructor;
	}

	/**
	 * Async version of CustomElementRegistry.upgrade method. First it resolves all the lazy defined
	 * elements, then proceed to upgrade them.
	 *
	 * @param {Element} root the element to be upgraded, together with its descendants
	 */
	async upgrade(root) {
		const elements = this.extractElements([root]);
		await this.upgradeElements(elements);
		registry.upgrade(root);
	}

	/**
	 * Exact same feature as CustomElementRegistry.whenDefined.
	 *
	 * @param {string} name a custom element or custom built-in element name
	 * @returns {Promise} resolves when the custom element constructor has been defined
	 */
	whenDefined(name) {
		return registry.whenDefined(name);
	}

	/**
	 * Same feature provided by {@link LazyCustomElementRegistry#upgrade} but without forcing the
	 * definition of lazy defined descendants.
	 *
	 * @param {Element} element the element to be upgraded
	 */
	async upgradeElement(element) {
		await this.prepareElement(element);
	}

	/**
	 * Same feature provided by {@link LazyCustomElementRegistry#upgrade} but for a list of elements
	 * and without forcing the definition of lazy defined descendants.
	 *
	 * @param {(Array|NodeList)} elements the elements to be upgraded
	 */
	async upgradeElements(elements) {
		await Promise.all([...elements].map((element) => this.prepareElement(element)));
	}

	/**
	 * Async equivalent of node.querySelector() followed by forcing a definition of the eventually
	 * lazy defined custom element and an upgrade of the found element.
	 *
	 * @param {(Document|Element)} node the document or node to be queried
	 * @param {string} selectors a string containing one or more comma-separated selectors to match
	 * @returns {Promise<?Element>} returns a promise that resolves with the found element or null
	 */
	async querySelector(node, selectors) {
		if (!(node instanceof Document) && !(node instanceof Element)) {
			return null;
		}
		const element = node.querySelector(selectors);
		if (element) {
			await this.prepareElement(element);
		}
		return element;
	}

	/**
	 * Async equivalent of node.querySelectorAll() followed by forcing a definition of the
	 * eventually lazy defined custom elements and an upgrade of the found elements.
	 *
	 * @param {(Document|Element)} node the document or node to be queried
	 * @param {string} selectors a string containing one or more comma-separated selectors to match
	 * @returns {Promise<?NodeList>} returns a promise that resolves with the found elements
	 * NodeList or null in case the node is not an instance of Document or Element to be queried
	 */
	async querySelectorAll(node, selectors) {
		if (!(node instanceof Document) && !(node instanceof Element)) {
			return null;
		}
		const elements = node.querySelectorAll(selectors);
		if (elements && elements.length) {
			await this.upgradeElements(elements);
		}
		return elements;
	}

	/**
	 * It works exactly like document.createElement with a single additional feature to solve a
	 * weird thing. When the standard document.createElement is used to create a custom built-in
	 * element (passing an options object as a second parameter, with the "is" property filled), it
	 * set the is attribute in a way that is not properly queryable with the usual methods. Let's
	 * say you do something like:
	 *
	 * ``` javascript
	 * class MyCustomParagraph extends HTMLParagraphElement {}
	 * customElements.define('my-custom-paragraph', MyCustomParagraph, {extends: 'p'});
	 * const p = document.createElement('p', {is: 'my-custom-paragraph});
	 * console.log(p.matches('[is="my-custom-paragraph"]'));
	 * // unexpectedly it prints false
	 * // same if you attach the element in the dom and try to query it by "is" attribute, you will get no results
	 * ```
	 *
	 * So in those cases, this method forces a setAttribute call with the proper values that allows
	 * the element to be queryable as expected.
	 *
	 * @param {string} tagName the tagName of the Element to be created
	 * @param {(undefined|object)} [options] An optional object eventually containing the property
	 * is
	 * @param {string} [options.is] The tagName of a custom built-in element
	 * @returns {Element} the created Element
	 */
	createElement(tagName, options) {
		const element = document.createElement(tagName, options);
		if (options && 'is' in options) {
			element.setAttribute('is', options.is);
		}
		return element;
	}

	/**
	 * Sets / overwrites config options
	 *
	 * @param {object} options An object containing configuration options
	 * @param {string} [options.autodefineAttribute=data-autodefine] attribute name (usually a data-attribute) to
	 * control the autodefinition behavior on the defined custom elements. Valid attribute values are 'true' (will be
	 * defined as soon as it is intercepted in the DOM), 'lazy' or an alternative value defined in options.lazyValue
	 * (will be defined when one element of this type intercepts a defined area around the viewport) or 'false' (will
	 * not be defined automatically, it will require an upgrade call to force the definition)
	 * @param {string} [options.lazyValue=lazy] value used to define the lazy behavior (both for autodefine and
	 * autoload features)
	 * @param {(Document|HTMLElement)} [options.autodefineRoot=document] root used for the autodefine
	 * IntersectionObserver
	 * @param {string} [options.autodefineRootMargin=100% 0px 100% 0px] margin used for the autodefine
	 * IntersectionObserver. By default it has a 100% height margin both above and below the viewport
	 * @param {number} [options.autodefineThreshold=0] threshold used for the autodefine IntersectionObserver
	 * @param {string} [options.autodefineDefaultValue=lazy] the default value for the autodefine attribute
	 * @param {(Document|HTMLElement)} [options.autoloadRoot=document] root used for the autoload IntersectionObserver
	 * @param {string} [options.autoloadRootMargin=50% 0px 50% 0px] margin used for the autoload
	 * IntersectionObserver. By default it has a 50% height margin both above and below the viewport
	 * @param {number} [options.autoloadThreshold=0] threshold used for the autodefine IntersectionObserver
	 * @param {string} [options.autoloadAttribute=data-autoload] attribute name (usually a data-attribute) to
	 * control the autoloading behavior on the defined custom elements. Valid attribute values are 'true' (will call the
	 * load method as soon as it is intercepted in the DOM), 'lazy', or an alternative value defined in
	 * options.lazyValue (will call the load method when the element is intercepted in a defined area around the
	 * viewport). Any other value will be ignored. Differently from the autodefine, elements that want to subscribe to
	 * the autoloading feature needs to have this attribute set.
	 * @param {string} [options.loadMethod=load] Name of the method to be called when the load is triggered
	 * @param {?(string|boolean)} [options.firstConnectedCallbackMethod=firstConnectedCallback] if the custom
	 * element class contains this method, it will be called only the first time the elements are connected to the
	 * document instead of the connectedCallback() method, which instead will be called (if available) on every
	 * reconnection after the first one. An empty string or a falsy value can be passed to disable the feature when the
	 * class contains such a method but you don't want to subscribe to this automated behavior.
	 */
	setOptions(options) {
		assign(this.options, options);
	}

	/**
	 * returns a copy of an the configuration options, to avoid accidental modification outside of the registry's scope.
	 * @see {@link LazyCustomElementRegistry#setOptions} for the full list of the options.
	 *
	 * @returns {object} a copy of the configuration options of the `options` object.
	 */
	getOptions() {
		return assign({}, this.options);
	}

	/**
	 * returns a copy of an the default configuration options, to avoid accidental modification.
	 * @see {@link LazyCustomElementRegistry#setOptions} for the full list of the options.
	 *
	 * @returns {object} a copy of the default configuration options of the `options` object.
	 */
	getDefaultOptions() {
		return assign({}, defaultOptions);
	}

	/**
	 * Prepares a custom element in case it was not already done before: it initializes
	 * IntersectionObservers for lazy definition and lazy loading, when needed and upgrade the
	 * element after their definition.
	 *
	 * @private
	 *
	 * @param {Element} element the element to be prepared
	 * @param {boolean} [force=true] when the element is discovered in the dom by the internal
	 * MutationObserver, the value is false, since we don't want to force the definition of lazy
	 * defined elements. In all the other cases, like calling upgrade() or querySelector, the value
	 * will be true.
	 */
	async prepareElement(element, force = true) {
		// we need to be sure the element is a real Element
		if (!element || !(element instanceof Element)) {
			return;
		}
		// if the element is not a custom element nor a custom built-in element there is nothing to
		// be done
		const name = (element.getAttribute('is') || element.tagName).toLowerCase();
		if (!name.includes('-')) {
			return;
		}
		// elements are tracked with a WeakMap to avoid to do the same work twice
		let componentEntry = this.components.get(element);
		if (!componentEntry) {
			const entry = this.getEntry(name);
			componentEntry = {
				autodefineTrigger: null,
				autoloadTrigger: null,
				register: null,
				registering: false,
				get: () => {
					if (registry.get(name)) {
						registry.upgrade(element);
						return element;
					}
					return registry.whenDefined(name).then(() => {
						registry.upgrade(element);
						return element;
					});
				},
			};
			this.components.set(element, componentEntry);
			if (entry) {
				// initialize autodefinition and autoloading
				this.autodefine(name, element, entry, componentEntry, force);
				this.autoload(element, entry, componentEntry);
			}
		}
		// when it is required to have a ready component, we force the registration ignoring
		if (force && !componentEntry.registering && componentEntry.register) {
			componentEntry.registering = true;
			componentEntry.register();
		}
		// wait for the element to be defined
		await componentEntry.get();
	}

	/**
	 * Schedules a check and clears any existing timeout before setting a new one. Avoid unnecessary
	 * work when there are multiple subsequent calls to define()
	 *
	 * @private
	 *
	 */
	scheduleCheck() {
		if (this.checkTimeout) {
			clearTimeout(this.checkTimeout);
		}
		this.checkTimeout = setTimeout(() => this.check(), 0);
	}

	/**
	 *  Checks for changes in the DOM and prepare elements accordingly
	 *
	 * @private
	 *
	 */
	check() {
		// when called after a define() we will search in the dom in case defined elements already
		// exists there
		for (const element of this.extractElements([document.body])) {
			this.prepareElement(element, false);
		}
		// initialize the internal MutationObserver if it has not already been done
		if (!this.domObserver) {
			this.domObserver = new MutationObserver((entries) => {
				for (const entry of entries) {
					for (const element of this.extractElements([...entry.addedNodes])) {
						this.prepareElement(element, false);
					}
				}
			});
			this.domObserver.observe(document.body, {
				childList: true,
				subtree: true,
			});
		}
	}

	/**
	 * Callback called by both autodefine and autoload IntersectionObservers. When an element is
	 * intersecting, it stops to observe it and call the corresponding element trigger that was
	 * prepared before.
	 *
	 * @private
	 *
	 * @param {string} observerType 'autodefine' or 'autoload'
	 * @param {IntersectionObserverEntry[]} entries the entries that triggered an observed change
	 * @param {IntersectionObserver} observer the observer itself
	 */
	onIntersect(observerType, entries, observer) {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				const element = entry.target;
				// stop to observe the element at the first valid intersection
				observer.unobserve(element);
				const componentEntry = this.components.get(element);
				// call the trigger
				if (componentEntry) {
					const triggerName = observerType + 'Trigger';
					if (componentEntry[triggerName]) {
						componentEntry[triggerName]();
						componentEntry[triggerName] = null;
					}
				}
			}
		}
	}

	/**
	 * Extracts from a list of given nodes all elements that match the registered custom elements or
	 * custom built-in elements
	 *
	 * @private
	 *
	 * @param {Element[]} nodes array of elements that will be queried to find registered custom
	 * elements (including the elements themself)
	 * @returns {Element[]} the elements that match the registered custom elements or custom
	 * built-in elements
	 */
	extractElements(nodes) {
		return nodes.reduce(
			(res, node) =>
				res.concat(node.matches(this.selectors) ? [node] : [], [
					...node.querySelectorAll(this.selectors),
				]),
			[]
		);
	}

	/**
	 * Initialize the autodefinition of the element based on the global and eventually custom
	 * configuration
	 *
	 * @private
	 *
	 * @param {string} name custom element or custom built-in element name
	 * @param {Element} element the element to be eventually observed
	 * @param {object} entry config object eventually containing custom options for the specific
	 * definition
	 * @param {object} componentEntry internal entry used to monitor the specific element
	 * @param {boolean} force false when the element has been intercepted by the mutation
	 * observed, true in all the other cases in which the element has been manually queried or
	 * upgraded
	 */
	autodefine(name, element, entry, componentEntry, force) {
		// if the custom element is already defined there is nothing to be done
		if (!registry.get(name)) {
			// we let the custom options to eventually override the global ones
			const {autodefineAttribute, lazyValue, autodefineDefaultValue} = assign(
				{},
				this.options,
				entry
			);
			// any single element can override the autodefine behavior with a specific attribute (by
			// default a data attribute)
			const autodefine = element.hasAttribute(autodefineAttribute)
				? element.getAttribute(autodefineAttribute)
				: autodefineDefaultValue;
			// actual registration function, that wait for the lazy definition and double-check to
			// avoid to register the element twice due to async behavior
			componentEntry.register = async () => {
				if (!registry.get(name)) {
					const constructor = await this.get(name);
					if (!registry.get(name)) {
						if (element.hasAttribute('is')) {
							registry.define(name, constructor, {extends: element.tagName.toLowerCase()});
						} else {
							registry.define(name, constructor);
						}
					}
				}
			};
			// when the element is queried or upgraded manually or it declares an autodefine
			// attribute = 'true' we register it immediately
			if (force || autodefine === 'true') {
				componentEntry.registering = true;
				componentEntry.register();
			} else if (autodefine === lazyValue) {
				// otherwise we create a registration promise to be resolved lazily only when the
				// element intersects
				new Promise((autodefineTrigger) => {
					componentEntry.autodefineTrigger = autodefineTrigger;
				}).then(() => {
					componentEntry.registering = true;
					componentEntry.register();
				});
				// get a proper observer and start to observe the element
				this.getObserver('autodefine', entry).observe(element);
			}
		}
	}

	/**
	 * Initialize the autoloading of the element based on the global and eventually custom
	 * configuration and on the element attributes
	 *
	 * @private
	 *
	 * @param {Element} element the element to be eventually observed
	 * @param {object} entry config object eventually containing custom options for the specific
	 * definition
	 * @param {object} componentEntry internal entry used to monitor the specific element
	 */
	autoload(element, entry, componentEntry) {
		// we let the custom options to eventually override the global ones
		const {autoloadAttribute, loadMethod, lazyValue} = assign({}, this.options, entry);
		const hasAutoload = element.hasAttribute(autoloadAttribute);
		const autoload = hasAutoload ? element.getAttribute(autoloadAttribute) : false;
		// only elements with a proper autoload attribute and with a value !== 'false' will be taken
		// into consideration for autoload behavior
		if (autoload && autoload !== 'false') {
			// the actual load call. It checks that the load method exists on the element before
			// calling it
			const load = () => {
				if (loadMethod in element && element[loadMethod] instanceof Function) {
					element[loadMethod]();
				}
			};
			// when the attribute value is 'true' we trigger the load immediately
			if (autoload === 'true') {
				componentEntry.get().then(() => load());
			} else if (autoload === lazyValue) {
				// otherwise when the element requires an lazy load we define a load promise that is
				// going to be lazily resolved only when the element intersects
				const autoloadPromise = new Promise((autoloadTrigger) => {
					componentEntry.autoloadTrigger = autoloadTrigger;
				});
				// autoload call will be performed only after the element is defined and upgraded
				componentEntry
					.get()
					.then(() => autoloadPromise)
					.then(() => load());
				// get a proper observer and start to observe the element
				this.getObserver('autoload', entry).observe(element);
			}
		}
	}

	/**
	 * Prepare a constructor by ensuring it is the desired class, and eventually subclass to
	 * implement the firstConnectedCallback pattern
	 *
	 * @private
	 *
	 * @param {Function} constructor the function that generates a constructor or the constructor to
	 * be prepared
	 * @returns {Function} the constructor ready to be registered
	 */
	prepareConstructor(constructor, options) {
		if (options.extends) {
			// when the constructor was defined as a mixin in the form const ClassName = (Base)
			// => class extends Base {} it is still not yet a proper Element constructor, it
			// needs to be called passing the actual parent constructor
			const parentConstructor = getParentConstructor(options.extends);
			if (!(constructor.prototype instanceof parentConstructor)) {
				constructor = constructor(parentConstructor);
			}
		}
		// if enabled and the method is available in the given constructor, it subclass the
		// constructor to implement a firstConnectedCallback mechanism. That method is going to
		// be called only the first time (without calling connectedCallback(), while
		// connectedCallback() is going to be called all the next times)
		const firstConnectedCallbackMethod =
			'firstConnectedCallbackMethod' in options
				? options.firstConnectedCallbackMethod
				: this.options.firstConnectedCallbackMethod;
		if (
			firstConnectedCallbackMethod &&
			isString(firstConnectedCallbackMethod) &&
			firstConnectedCallbackMethod in constructor.prototype
		) {
			const hasConnectedCallback = 'connectedCallback' in constructor.prototype;
			constructor = class extends constructor {
				connectedCallback() {
					if (elementsConnectedOnce.has(this)) {
						if (hasConnectedCallback) {
							super.connectedCallback();
						}
					} else {
						elementsConnectedOnce.add(this);
						this[firstConnectedCallbackMethod]();
					}
				}
			};
		}
		return constructor;
	}

	/**
	 * Retrieves an entry for a custom element. In case of custom built-in element defined throught
	 * mixin in order to support multiple parents, it clones the entry for the specific requested
	 * parent only when it's needed
	 *
	 * @private
	 *
	 * @param {string} name the name of the defined custom element or custom built-in element
	 * @returns {(object|undefined)} an entry object or undefined when the definition does not exist
	 */
	getEntry(name) {
		let baseName = name;
		let tagName = '';
		let entry = this.entries.get(name);
		if (!entry) {
			// for definition of custom built-in elements with multiple possible parents the base
			// name is in the form 'acme-whatever-' and the specific elements name are obtained
			// appending the tagName to the base name
			const parts = name.split('-');
			if (parts.length > 2) {
				tagName = parts.pop();
				baseName = parts.join('-') + '-';
			}
			const baseEntry = this.entries.get(baseName);
			if (baseEntry) {
				if (baseEntry.extends === tagName || baseEntry.extends === '*') {
					entry = assign({}, baseEntry);
					entry.extends = tagName;
					this.entries.set(name, entry);
				}
			}
		}
		return entry;
	}

	/**
	 * Returns an IntersectionObserver object based on the given type and options. Observers get reused when the type
	 * and options have been already used to create one before, so only the necessary amount of them is created.
	 *
	 * @private
	 *
	 * @param {string} type 'autodefine' or 'autoload'
	 * @param {object} options additional options like threshold, root margins  @see {@link LazyCustomElementRegistry#setOptions}
	 * @returns {IntersectionObserver}
	 */
	getObserver(type, options) {
		// observers groups are stored in a WeakMap by their root (which can be a Document or an Element)
		const rootName = type + 'Root';
		const root = rootName in options ? options[rootName] : this.options[rootName];
		let map = this.observers.get(root);
		if (!map) {
			map = {};
			this.observers.set(root, map);
		}
		// observer name inside each group is defined by their type ('autodefine' or 'autoload'),
		// rootMargin and threshold
		const parts = [type];
		for (const suffix of ['RootMargin', 'Threshold']) {
			const propName = type + suffix;
			const prop = propName in options ? options[propName] : this.options[propName];
			parts.push(prop);
		}
		const observerName = parts.join('-');
		if (!map[observerName]) {
			map[observerName] = new IntersectionObserver(
				(entries, obs) => this.onIntersect(type, entries, obs),
				{
					root: root,
					rootMargin: parts[1], // margins
					threshold: parts[2], // threshold
				}
			);
		}
		return map[observerName];
	}
}

/**
 * A shared instance of LazyCustomElementRegistry
 * @instance
 * @type LazyCustomElementRegistry
 */
const lazyCustomElements = new LazyCustomElementRegistry();

export {lazyCustomElements};

export {LazyCustomElementRegistry};
