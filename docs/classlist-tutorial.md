# classList 

Like the standard element.classList but taking a namespace or prefix into account.

- [Setup](#setup)
- [Import](#import)
- [Setting the namespace](#setting-the-namespace)
- [Add classes](#add-classes)
- [Remove classes](#remove-classes)
- [Check if a class name is set](#contains)
- [Toggle classes](#toggle-classes)
- [Replace classes](#replace-classes)
- [Iterate trhough classes](#iterators)
- [Query elements using class selectors](#query-elements)
- [Extend the base class](#extend)

<a id="setup"></a>

## Setup

```
npm install --save nuffjs;
```

<a id="import"></a>

## Import

```js
import {classList} from 'nuffjs';
```

<a id="setting-the-namespace"></a>

## Setting the namespace

```js
import {classList} from 'nuffjs';

classList.setNs('js-');

// reading a previously set namespace
console.log(classList.getNs()); // 'js-'
```

<a id="add-classes"></a>

## Add classes

```js
import {classList} from 'nuffjs';

classList.setNs('js-');
const element = document.createElement('div');

classList(element).add('aaa');
// <div class="js-aaa"></div>

classList(element).add('bbb', 'ccc');
// <div class="js-aaa js-bbb js-ccc"></div>

const cl = classList(element, 'acme-');

cl.add('aaa', 'bbb');
// <div class="js-aaa js-bbb js-ccc acme-aaa acme-bbb"></div>
```

<a id="remove-classes">

## Remove classes

Somewhere in the document:
```html
<div id="test" class="js-aaa js-bbb js-ccc acme-aaa acme-bbb"></div>
```

```js
import {classList} from 'nuffjs';

classList.setNs('js-');
const element = document.querySelector('#test');

classList(element).remove('aaa');
// <div id="test" class="js-bbb js-ccc acme-aaa acme-bbb"></div>


classList(element).remove('bbb', 'ccc');
// <div id="test" class="acme-aaa acme-bbb"></div>

const cl = classList(element, 'acme-');

cl.remove('aaa', 'bbb');
// <div class=""></div>
```

<a id="contains"></a>

## Check if a class name is set

Somewhere in the document:
```html
<div id="test" class="js-aaa js-bbb js-ccc acme-ddd acme-eee"></div>
```

```js
import {classList} from 'nuffjs';

classList.setNs('js-');
const element = document.querySelector('#test');

console.log(classList(element).contains('aaa'));		// true
console.log(classList(element).contains('ddd'));		// false
console.log(classList(element, '').contains('aaa'));	// false
console.log(classList(element, '').contains('js-aaa'));	// true

const cl = classList(element, 'acme-');
console.log(cl.contains('ddd'));	// true
console.log(cl.contains('eee'));	// true

```

<a id="toggle-classes"></a>

## Toggle classes

Somewhere in the document:
```html
<div id="test" class="js-aaa js-bbb js-ccc acme-ddd acme-eee"></div>
```

```js
import {classList} from 'nuffjs';

classList.setNs('js-');
const element = document.querySelector('#test');

classList(element).toggle('aaa');
// <div id="test" class="js-bbb js-ccc acme-ddd acme-eee"></div>

classList(element).toggle('ddd', true);
// <div id="test" class="js-bbb js-ccc acme-ddd acme-eee js-ddd"></div>

classList(element, 'acme-').toggle('eee', false);
// <div id="test" class="js-bbb js-ccc acme-ddd js-ddd"></div>

classList(element).toggle('bbb');
// <div id="test" class="js-ccc acme-ddd js-ddd"></div>

```

<a id="replace-classes"></a>

## Replace classes

Somewhere in the document:
```html
<div id="test" class="js-aaa js-bbb js-ccc acme-ddd acme-eee"></div>
```

```js
import {classList} from 'nuffjs';

classList.setNs('js-');
const element = document.querySelector('#test');

classList(element).replace('aaa', 'zzz');
// <div id="test" class="js-bbb js-ccc acme-ddd acme-eee js-zzz"></div>

classList(element, 'acme-').replace('eee', 'fff');
// <div id="test" class="js-bbb js-ccc acme-ddd js-zzz acme-fff"></div>

```

<a id="iterators"></a>

## Iterate trhough classes

Somewhere in the document:
```html
<div id="test" class="js-aaa js-bbb js-ccc acme-ddd acme-eee"></div>
```

```js
import {classList} from 'nuffjs';

classList.setNs('js-');
const element = document.querySelector('#test');

for (const name of classList(element).values()) {
	console.log(name);
}
// logs: aaa, bbb

for (const name of classList(element, 'acme-').values()) {
	console.log(name);
}
// logs: ddd, eee

console.log(classList(element).length);				// 3
console.log(classList(element, 'acme-').length);	// 2
console.log(classList(element, 'test-').length);	// 0

```

<a id="query-elements"></a>

## Query elements using class selectors


```js
import {classList} from 'nuffjs';

classList.setNs('js-');

console.log(classList.className('aaa'));			// js-aaa
console.log(classList.className('aaa', 'acme'));	// acme-aaa
console.log(classList.className('aaa', ''));		// aaa

console.log(classList.selector('aaa'));				// .js-aaa
console.log(classList.selector('aaa bbb'));			// .js-aaa.js-bbb
console.log(classList.selector(['aaa', 'bbb']));	// .js-aaa.js-bbb

```

<a id="extend"></a>

## Extend the base class

```js
import {ClassList} from 'nuffjs';

class MyClassList extends ClassList {}


```
