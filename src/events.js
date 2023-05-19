//! nuff/events - @author Federico Orru' - @license Artistic-2.0

import {keys, isArray, throttle} from './utils';

let lateEventsOrder = 0;
// Late events make sense only for objects that are still referenced in the
// code, so we store them in a WeakMap using the dispatcher as key, in order to
// not prevent their garbage collection.
const lateEvents = new WeakMap();
const hiddenTargets = new WeakMap();
const eventTargetsCache = new WeakMap();

/**
 * Associates an EventTarget to objects that are not instances of EventTarget on their own
 *
 * @private
 *
 * @param {object} target the object to map to an event target
 * @returns {EventTarget} the associated event target
 */
function getHiddenTarget(target) {
	let hiddenTarget = hiddenTargets.get(target);
	if (!hiddenTarget) {
		hiddenTarget = new EventTarget();
		hiddenTargets.set(target, hiddenTarget);
	}
	return hiddenTarget;
}

/**
 * Verifies that an object is an instance of EventTarget or at least implement the same interface
 *
 * @private
 *
 * @param {object} target the object to be verified
 * @returns {boolean}
 */
const isValidEventTarget = (target) =>
	('EventTarget' in window && target instanceof EventTarget) ||
	['addEventListener', 'removeEventListener', 'dispatchEvent'].filter((method) => method in target).length === 3;

/**
 * Checks if the value passed is a valid event listener, meaning it is a function or an object with a handleEvent() method
 *
 * @private
 *
 * @param {?(Function|object)} listener object to be verified
 * @returns {boolean}
 */
const isValidListener = (listener) => listener && (listener instanceof Function || ('handleEvent' in listener && listener.handleEvent instanceof Function));

/**
 * Sets up an EventListener
 *
 * @param {(object|EventTarget)} target an EventTarget (or any other JS object) to listen for the
 * event(s). Objects that are not natively EventTarget will be mapped internally to an EventTarget
 * in order to emulate the listening.
 * @param {(string|string[])} types a single event type or an array of event types or a
 * space-separated list of event type. Example: 'click', ['mouseenter', 'mouseleave'], 'resize
 * scroll'.
 * @param {(function|object)} [listener] a function or object that implement the handleEvent()
 * method
 * @param {(object|boolean)} [options] contains the listening options. Accepts all the standrd
 * options accepted by addEventListener - capture, once, passive, signal - plus three additional
 * custom properties used to provide additional - non standard - features.
 * @param {string} [options.selector] used to implement event delegation. The listener will be
 * called only when the event has been dispatched by elements nested in the target that match the
 * selector.
 * @param {(number|boolean)} [options.throttle] when throttle is true, the requestAnimationFrame
 * will be used to throttle the calls to the listeners. When it is a number, it will be used as
 * milliseconds mimimum interval between the calls. The throttled listener is guaranteed to be
 * called both with the first and the last event, while those in between may be ignored. The last
 * call could be delayed in respect to the actual event moment.
 * @param {boolean} [options.late] when the late flag is true, the listener can be called (and the
 * inner promise resolved) also if a 'late' event has been dispatched before setting up the
 * listener. A late event is a CustomEvent dispatched by the [dispatch() function]{@link dispatch}
 * setting the late option to true.
 * @returns {EventListener} an instance of EventListener configured with the given parameter
 */
function listen(target, types, listener, options) {
	return new EventListener(target, types, listener, options);
}

/**
 * Dispaches an event for the given target
 *
 * @param {object|EventTarget} target an EventTarget (or any other JS object) that will dispatch the
 * event. Objects that are not natively EventTarget will be mapped internally to an EventTarget in
 * order to emulate the dispatching.
 * @param {(string|Event)} type a type of a custom event to be created or an already created Event
 * object
 * @param {object} [options] can contain the standard options to create an event (details, bubbles,
 * cancelable, composed), plus an additional 'late' option
 * @param {boolean} [options.late=false] when passed and true, the event will be kept after the
 * dispatch in order to be notified also to "late listeners", that are event listeners created with
 * the late flag after the event has been already dispatched
 * @fires Event
 * @returns {Event} the dispatched event object
 */
function dispatch(target, type, options = {}) {
	const late = !!options.late;
	delete options.late;
	const event = type instanceof Event ? type : new CustomEvent(type, options);
	const eventTarget = isValidEventTarget(target) ? target : getHiddenTarget(target);
	if (late) {
		type = event.type;
		let entry = lateEvents.get(eventTarget);
		if (!entry) {
			entry = {};
			lateEvents.set(eventTarget, entry);
		}
		entry[type] = {order: lateEventsOrder++, event: event};
	}
	eventTarget.dispatchEvent(event);
	return event;
}

/**
 * EventListener objects are thenable objects that allows to remove the listener and get a promise
 * resolved after the event has been dispatched.
 *
 */
class EventListener {
	/**
	 * Creates an instance of EventListener.
	 *
	 * @param {(object|EventTarget)} target an EventTarget (or any other JS object) to listen for the
	 * event(s)
	 * @param {(string|string[])} types a single event type or an array of event types or a
	 * space-separated list of event type. Example: 'click', ['mouseenter', 'mouseleave'], 'resize
	 * scroll'.
	 * @param {(function|object)} [listener] a function or object that implement the handleEvent()
	 * method
	 * @param {(object|boolean)} [options] contains the listening options. Accepts all the standrd
	 * options accepted by addEventListener - capture, once, passive, signal - plus three additional
	 * custom properties used to provide additional - non standard - features.
	 * @param {string} [options.selector] used to implement event delegation. The listener will be
	 * called only when the event has been dispatched by elements nested in the target that match the
	 * selector.
	 * @param {(number|boolean)} [options.throttle] when throttle is true, the requestAnimationFrame
	 * will be used to throttle the calls to the listeners. When it is a number, it will be used as
	 * milliseconds mimimum interval between the calls. The throttled listener is guaranteed to be
	 * called both with the first and the last event, while those in between may be ignored. The last
	 * call could be delayed in respect to the actual event moment.
	 * @param {boolean} [options.late] when the late flag is true, the listener can be called (and the
	 * inner promise resolved) also if a 'late' event has been dispatched before setting up the
	 * listener. A late event is a CustomEvent dispatched by the [dispatch() function]{@link dispatch}
	 * setting the late option to true.
	 */
	constructor(target, types, listener, options) {
		// accept a list of event types both as an array or as a space-separated string
		if (!isArray(types)) {
			types = types.split(/\s+/);
		}

		// it could be called passing only 3 arguments in which the listener is omitted and the options
		// params shifts to the left
		if (!options && !isValidListener(listener)) {
			options = listener;
			listener = null;
		}

		// when the options is boolean it corresponds to setting the capture flag
		if (!options) {
			options = {capture: false};
		} else if (options === true) {
			options = {capture: true};
		}

		// it can listen to events from any kind of object. When the target is not a valid event target,
		// we map it to an hidden EventTarget
		const isEventTarget = isValidEventTarget(target);
		const eventTarget = isEventTarget ? target : getHiddenTarget(target);

		// selector option used to implement event delegation makes sense only if the target is an
		// Element or a Document
		const selector = target instanceof Element || target instanceof Document ? options.selector : null;
		const throttleValue = options.throttle;
		const late = !!options.late;

		// without a listener, we force the once flag, because the event would be notified only once
		// through the returned Promise-like object anyway
		if (!listener) {
			options.once = true;
		}
		this.once = !!options.once;

		// we remove the custom properties from the options, in order to leave only the standard options
		// to be passed to the native addEventListener call
		delete options.selector;
		delete options.throttle;
		delete options.late;
		if (!keys(options).length) {
			options = false;
		}

		// we prepare the promise to be resolved after the first event is intercepted
		let triggerResolve;
		const promise = new Promise((resolve) => {
			triggerResolve = resolve;
		});

		// we will store a different throttled handler for each listened event type
		const throttled = {};
		this.done = false;
		let resolved = false;

		// internal handler, calling the provided listener and resolving the promise
		const handle = (event) => {
			let delegateTarget = eventTarget;
			// when a selector was specified, we consider only events originated by the matching
			// elements and their descendants
			if (selector) {
				const closestMatch = event.target.closest(selector);
				delegateTarget = closestMatch && eventTarget.contains(closestMatch) ? closestMatch : null;
			}
			if (delegateTarget) {
				const targetParam = isEventTarget ? delegateTarget : target;
				if (listener && !(this.once && this.done)) {
					if ('handleEvent' in listener && listener.handleEvent instanceof Function) {
						listener.handleEvent(event, targetParam);
					} else {
						listener(event, targetParam);
					}
				}
				this.done = true;
				if (!resolved) {
					resolved = true;
					triggerResolve(event);
				}
			}
		};

		// the actual handler being registered, which takes care of throttling the internal handle
		// when requested
		const handler = (event) => {
			// we have to throttle a separate function for each listened event type
			const type = event.type;
			if (throttleValue) {
				if (!(type in throttled)) {
					throttled[type] = throttle(handle, throttleValue);
				}
				throttled[type](event);
			} else {
				handle(event);
			}
		};

		// if requesting for late events, we check immediately if the events already fired before
		// the call
		if (late) {
			// events could have been dispatched by the target itself or by any descendants
			let lateTargets = [eventTarget];
			if (target === eventTarget && 'querySelectorAll' in target) {
				lateTargets = lateTargets.concat([...target.querySelectorAll(selector ? selector : '*')]);
			}
			const pendingEvents = [];
			for (const lateTarget of lateTargets) {
				const entries = lateEvents.get(lateTarget);
				if (entries) {
					for (const type of types) {
						if (type in entries) {
							pendingEvents.push(entries[type]);
							break;
						}
					}
				}
			}
			// when there are multiple pending events we call the handler only with the last one
			if (pendingEvents.length) {
				pendingEvents.sort((a, b) => b.order - a.order);
				handle(pendingEvents[0].event);
			}
		}

		// we register an actual native listener only if the listening has not been already
		// fulfilled by previously dispatched late events
		if (!this.once || !this.done) {
			types.map((type) => eventTarget.addEventListener(type, handler, options));
		}

		// make vars accessible by other methods
		this.promise = promise;
		this.options = options;
		this.types = types;
		this.handler = handler;
		this.eventTarget = eventTarget;
	}

	/**
	 * Return a promise that resolves when the first listened event has been dispatched.
	 *
	 * @param {Function} [callback] optional callback to be called after the promise's resolution.
	 * @returns {Promise<Event>} the returned promise is resolved with the Event object.
	 */
	then(callback) {
		return this.promise.then(callback);
	}

	/**
	 * Remove the event(s) listener(s).
	 *
	 */
	unlisten() {
		if (!this.once || !this.done) {
			this.types.map((type) => this.eventTarget.removeEventListener(type, this.handler, this.options));
		}
	}
}

/**
 * Object that wraps another object (the event target) in order to call listen() or dispatch() event
 * without repeating the target every time.
 * May be practical if you needs to perform several event-related calls.
 */
class WrappedEventTarget {
	/**
	 * Creates an instance of WrappedEventTarget.
	 * @param {(object|EventTarget)} target an EventTarget (or any other JS object) that can
	 * dispatch events and can to be listened for events.
	 */
	constructor(target) {
		this.target = target;
	}

	/**
	 * Attaches an event listener to the target.
	 * @see [listen() function]{@link listen} for details about the parameters and the return value
	 *
	 */
	listen(types, listener, options) {
		return new EventListener(this.target, types, listener, options);
	}

	/**
	 * Dispatches an event.
	 * @see [dispatch() function]{@link dispatch} for details about the parameters and the return
	 * value
	 *
	 */
	dispatch(type, options) {
		return dispatch(this.target, type, options);
	}
}

/**
 * Gives back a weakly cached WrappedEventTarget
 *
 * @param {(object|EventTarget)} target the object to be wrapped
 * @returns {WrappedEventTarget} the WrappedEventTarget associated with the given target
 */
function eventTarget(target) {
	let wrapped = eventTargetsCache.get(target);
	if (!wrapped) {
		wrapped = new WrappedEventTarget(target);
		eventTargetsCache.set(wrapped);
	}
	return wrapped;
}

export {listen, dispatch, eventTarget, EventListener, WrappedEventTarget};
