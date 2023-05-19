# lazyCustomElements

The LazyCustomElementRegistry class is a Custom Element registry for defining and upgrading custom
elements in a lazy manner, plus some interesting additional features.

**Important**: Since Safari's team currently refuses to implement Custom Built-in Elements, if you
want to use them you would have to use a polyfill. I personally use
[@ungap/custom-elements](https://github.com/ungap/custom-elements).


## Setup

```
npm install --save nuffjs;
```

## Import

```js
import {lazyCustomElements} from 'nuffjs';
```

## Define custom elements and custom built-in elements synchrounously

```js
import {lazyCustomElements} from 'nuffjs';

class MyElement extends HTMLElement {}

class MyParagraph extends HTMLParagraphElement {}

// these are completely equivalent to using the standard customElements registry, 
// the only difference beign the define() calls are chainable
lazyCustomElements
	.define('acme-my-element', MyElement)
	.define('acme-my-paragraph', MyParagraph, {extends: 'p'});

```

## Define custom elements and custom built-in elements asynchrounously

You can register elements passing an async function that resolves with the constructor after a
dynamic import (or any other type of asynchronous behavior). Nothing is immediately registered or
imported here. The definition will happen when the elements approach the viewport or when they are
directly requested to upgrade.

By default the define intersection area has a 100% margin above and below the viewport,
so elements will start to load a little bit earlier than being visible, but that's configurable.

```js
// my-element.js

class MyElement extends HTMLElement {}

export {MyElement};


// my-paragraph.js

class MyParagraph extends HTMLParagraphElement {}

export {MyParagraph};

// main.js
import {lazyCustomElements} from 'nuffjs';

lazyCustomElements
	.define('acme-my-element', async () => (await import('./my-element')).MyElement);
	.define('acme-my-paragraph', async () => (await import('./my-paragraph')).MyParagraph, {extends: 'p'});

```

## Retrieve a defined constructor

```js
import {lazyCustomElements} from 'nuffjs';

lazyCustomElements.define('acme-my-element', async () => (await import('./my-element')).MyElement);

// since the definition can be asynchronous, also the retrieval is asynchronous
const MyConstructor = await lazyCustomElements.get('acme-my-element'); // MyConstructor === MyElement
```

## Check when a custom element has been defined

This is completely equivalent to the standar registry

```js
import {lazyCustomElements} from 'nuffjs';

// these do exactly the same thing
await customElements.whenDefined('acme-my-element');
await lazyCustomElements.whenDefined('acme-my-element');

```

## Control when a custom element will be defined

By default the define behavior is set to "lazy", but there are other two ways: define as soon as
detected in the document and define only manually, when the element definition is forced
programmatically by upgrading it.

Default behavior, the name of the used attributes and the parameter for the IntersectionObserver can
all be customized.

```html
<!-- this is the default behavior, element will be defined when approaching the viewport -->
<acme-my-lazy-component data-autodefine="lazy"></acme-my-component>

<!-- this element will be defined as soon as it is detected in the DOM, no matter is position or visibility -->
<acme-my-component data-autodefine="true"></acme-my-component>

<!-- this element will not be defined automatically, see the "Interact with lazy-defined custom elements" section -->
<acme-another-component data-autodefine="false"></acme-my-component>
```

## Upgrade elements
```js
import {lazyCustomElements} from 'nuffjs';

lazyCustomElements.define('acme-my-element', async () => (await import('./my-element')).MyElement);

const myElement = document.querySelector('acme-my-element');
// since the definition can be asynchronous, also the upgrade is asynchronous

// this define and upgrade the element itself and all the eventual descendants that has been lazily defined
await lazyCustomElements.upgrade(myElement);

// this define and upgrade the element itself but will not look for eventual descendants to be defined
await lazyCustomElements.upgradeElement(myElement);

// this define and upgrade a list of elements without looking for eventual descendants to be defined
await lazyCustomElements.upgradeElement(document.querySelectorAll('acme-another-element, acme-whatever-element'));
```


## Interact with lazy-defined custom elements 

Since the definition is asynchronous and lazy, when we query for a custom element in the DOM we are
not sure if the element has already been defined and upgraded.

The library offers several ways to interact with elements being sure they are already defined and
upgraded. These methods will force the definition also for elements having `data-autodefine="false"`.

```js
import {lazyCustomElements} from 'nuffjs';

lazyCustomElements.define('acme-my-element', async () => (await import('./my-element')).MyElement);

// querying asynchronously 
const myElement = await lazyCustomElements.querySelector(document, 'acme-my-element');
// (myElement instanceof MyElement) === true

// or 
const myElements = await lazyCustomElements.querySelectorAll(document, 'acme-my-element');
// array of MyElement instances 

// alternative: query synchronously and then upgrade the element
const myElem = await lazyCustomElements.upgradeElement(document.querySelector('acme-my-element'));
```

## Programmatically create custom built-in elements that are selectable by "is" attribute

```js
import {lazyCustomElements} from 'nuffjs';
import {MyParagraph} from './my-paragraph';

customElements.define('acme-my-paragraph', MyParagraph, {extends: 'p'});

// browsers do a weird thing:
const myParagraph = document.createElement('p', {is: 'acme-my-paragraph'});
console.log(myParagraph.matches('[is="acme-my-paragraph"]')); // false, WTF?!?

// so we provide a convenient method that solves the issue
const anotherParagraph = lazyCustomElements.createElement('p', {is: 'acme-my-paragraph'});
console.log(anotherParagraph.matches('[is="acme-my-paragraph"]')); // true
```

## Autoloading elements media and resources

Sometimes our custom elements and custom built-in elements needs to load additional media or data.
On top of the lazy-definition feature, the library offers also a lazy-load feature for this
additional situations.

By default, the components that want to subscribe to this feature needs to implement a load() method
and set a data-autoload attribute (method and attribute names are configurable as usual).

Similarly to the data-autodefine attribute, the data-autoload attribute supports 3 values: lazy,
true and false.  
By default the IntersectionObserver for lazy-loading has a margin of 50% above and below the
viewport.


```html
<!-- element's load() method will be called when approaching the viewport, 
	or immediately after the definition if the element has not been defined yet -->
<acme-my-lazy-component data-autoload="lazy"></acme-my-component>

<!-- element's load() method will be called as soon as it is detected in the DOM, 
	or immediately after the definition if the element has not been defined yet -->
<acme-my-component data-autoload="true"></acme-my-component>

<!-- this element's load() method will not be called automatically. 
	It is equivalent to not set the attribute  -->
<acme-another-component data-autoload="false"></acme-my-component>
```

```js
class MyLazyComponent extends HTMLElement {

	load() {
		// some heavy loading or process here
	}
}
```


## Implement firstConnectedCallback() pattern

Custom elements' connectedCallback() could be called multiple times, if the elements get detached
and attached again to the document. Often we need to perform some tasks only the first time the
callback is invoked.  
To avoid the boilerplate of manually handling this scenario, the library offers a convenient way to
have a separate method to be called the first time and the standard connectedCallback() to be called
all the other times after the first one. By default this additional method is called firstConnectedCallback().
If your class implements this method, then it is *subclassed* just before the definition.

```js
import {lazyCustomElements} from 'nuffjs';

class MyComponent extends HTMLElement {

	firstConnectedCallback() {
		// this will be called only the first time the element is connected
	}

	connectedCallback() {
		// this will NOT be called the first time
		// this will be called every time after the first one
	}
}

lazyCustomElements.define('acme-my-component', MyComponent);

const element = document.createElement('acme-my-component');

await lazyCustomElements.upgradeElement(element);

console.log(element instanceof MyComponent); // true
```


## Define custom built-in elements with multiple parents

Sometimes we may need to apply the same features to multiple type of elements. For example, we may
want to extend both a link and a button with the same feature, or apply a translation feature to any
element that can contain text, but without manually duplicating the code. A solution is to define
our custom built-in element as an anonymous class, defining the actual parent only on a later moment.

The library has support for this kind of approach.

```js
import {lazyCustomElements} from 'nuffjs';

/**
 * @param {(HTMLButtonElement|HTMLAnchorElement)} Base
 */
const MyClickableAction = (Base) =>
	class extends Base {
	};

// the name needs to end with a dash, the final name will be obtained appending the tagName 
lazyCustomElement.define('my-clickable-action-', MyClickableAction, {extends: ['a', 'button']});
// this is equivalent to these two calls: 
lazyCustomElement
	.define('my-clickable-action-a', MyClickableAction(HTMLAnchorElement), {extends: 'a'})
	.define('my-clickable-action-button', MyClickableAction(HTMLButtonElement), {extends: 'button'});

// in rare case you may want to not limit the type of parents upfront

/**
 * @param {Element} Base
 */
const MyVeryGenericThing = (Base) =>
	class extends Base {
	};

lazyCustomElement.define('my-very-generic-thing-', MyVeryGenericThing, {extends: '*'});
```


## Extend the base class

```js
import {LazyCustomElementRegistry} from 'nuffjs';

class MyLazyCustomElementRegistry extends LazyCustomElementRegistry {}

const myLazyCustomElements = new MyLazyCustomElementRegistry();

```
