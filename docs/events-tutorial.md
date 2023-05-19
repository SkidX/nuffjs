# Events

Standard DOM Event listening and dispatching, but on steroids.  
It supports delegation, throttling, listen to / dispatch events from any JS object (not only DOM
elements), *late listening* to custom events being dispatched in the past.

- [Setup](#setup)
- [Import](#import)
- [Events listening and unlistening](#events-listening-and-unlistening)
- [Listen to multiple event types](#listen-to-multiple-events)
- [Event delegation](#event-delegation)
- [Throttle events](#throttle-events)
- [Events meet Promises: await an event](#events-meet-promises)
- [Dispatch events](#dispatch-events)
- [Late listening: listen to events dispatched in the past](#late-listening)
- [Arbitrary targets for listen and dispatch](#arbitrary-targets)
- [Wrapping an event target](#wrapping-an-event-target)
- [Extend the base class](#extend)


<a id="setup"></a>

## Setup

```
npm install --save nuffjs;
```

<a id="import"></a>

## Import

```js
import {listen, dispatch} from 'nuffjs';
```

<a id="events-listening-and-unlistening"></a>

## Events listening and unlistening

```js
import {listen} from 'nuffjs';

// start to listen
const listener = listen(document.body, 'click', (event) => {});

// remove the event listener
listener.unlisten();

// setting standard listening options

// capture
listen(document.body, 'click', (event) => {}, {capture: true});
// passive and once
listen(document.body, 'click', (event) => {}, {passive: true, once: true});

// using an object for callbacks

const handler = {
	handleEvent(event) => {}
};
listen(document.body, 'click', handler);

// binding a context

class MyElement extends HTMLElement {

	connectedCallback() {
		listen(this, 'click', this.onClick.bind(this));
	}

	onClick(event) {
	}
}
```

<a id="listen-to-multiple-events"></a>

## Listen to multiple event types

```js
import {listen} from 'nuffjs';

listen(myElement, ['mousedown', 'touchstart'], (event) => {});
// or 
listen(myElement, 'mousedown touchstart', (event) => {});
```

<a id="event-delegation"></a>

## Event delegation

When calling the event handler, the library passes always two values, the event object and the
target. In case of event delegation, the target will always match the given selector.

```js
import {listen} from 'nuffjs';

const handler = (event, target) => {
	console.log(target.matches('.whatever')); // true
};

listen(myElement, 'click', handler, {selector: '.whatever'});

```

<a id="throttle-events"></a>

## Throttle events

Please be aware that when throttled, the first and last dispatch will always be delivered.


```js
import {listen} from 'nuffjs';

// throttle using requestAnimationFrame()
listen(window, 'resize', (event) => {}, {throttle: true});

// throttle using a time interval in ms
listen(window, 'scroll', (event) => {}, {throttle: 100});

```

<a id="events-meet-promises"></a>

## Events meet Promises: await an event

```js
import {listen} from 'nuffjs';

// it gets resolved (with the event) the first time the listened event is dispatched
const event = await listen(myComponent, 'my-component:load', (event) => {}, {once: true});

// it could also be done without setting an event handler. 
// when doing so, the once option is set automatically
await listen(myComponent, 'my-component:load');

// traditional then() method
listen(myComponent, 'my-component:load').then((event) => {
	// ...
});

```

<a id="dispatch-events"></a>

## Dispatch events 

```js
import {dispatch} from 'nuffjs';

// dispatch a pre constructed event object
const e = new CustomEvent('my:event', {bubbles: true, detail: {myData: 'here'}});
dispatch(myElement, e);

// dispatch a new event
const event = dispatch(myElement, 'my:event', {bubbles: true, detail: {myData: 'here'}});
```

<a id="late-listening"></a>

## Late listening: listen to events dispatched in the past

Sometimes when we start to listen to a target, it may be too late because the event we are
interested in has already been fired before. Typical case could be a custom 'load' event. This
library offers a way to keep track and listen to custom events after they have been already
dispatched.

```js
import {listen, dispatch} from 'nuffjs';

// dispatch a late event. Late events are normal events, 
// but the library will keep track of them for eventual late listeners.
// Late events are weakly associated to the emitting target, so when
// the target is not referenced anymore, the events will be garbage-collected as well.
dispatch(myElement, 'my:load', {bubbles: true, detail: {myData: 'here'}, late: true});

// later
await listen(myElement, 'my:load', {late: true});
// it resolves immediately since the event has been already dispatched

```

<a id="arbitrary-targets"></a>

## Arbitrary targets for listen and dispatch

The library extends the possibility to emit events to any kind of JS objects. The object's structure
will not be touched in any way to do so. When the object is not an EventTarget on its own, an
EventTarget will be internally associated to it in a transparent way.

```js
import {listen, dispatch} from 'nuffjs';

const myObj = {};

listen(myObj, 'my:event', (event, target) => {
	// target === myObj
});

dispatch(myObj, 'my:event', {detail: {customData: 'here'}});

```

<a id="wrapping-an-event-target"></a>

## Wrapping an event target

For convenience, it may be practical to wrap our event target in those situations in which we listen
or dispatch a lot of events, or when you like a more object oriented style of writing your code.


```js
import {listen, dispatch} from 'nuffjs';

const myObj = {};

const myTarget = eventTarget(myObj);

myTarget.listen('my:event', (event) => {
	//
});

myTarget.dispatch('my:event', {detail: {customData: 'here'}});

```

<a id="extend"></a>

## Extend the base classes

```js
import {EventListener, WrappedEventTarget} from 'nuffjs';

class MyEventListener extends EventListener {}

class MyWrappedEventTarget extends WrappedEventTarget {}

```
