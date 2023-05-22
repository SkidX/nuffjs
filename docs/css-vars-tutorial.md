# cssVars

Small utility to read / write CSS variables (custom properties) taking care of type casting.

- [Setup](#setup)
- [Import](#import)
- [Check if a CSS variable exists](#check-if-a-cc-variable-exists)
- [Read CSS variables](#read-css-variables)
- [Write CSS variables](#write-css-variables)
- [Remove CSS variables](#remove-css-variables)
- [Extend the base class](#extend)

<a id="setup"></a>

## Setup

```
npm install --save nuffjs;
```

<a id="import"></a>

## Import

```js
import {cssVars} from 'nuffjs';
```

<a id="check-if-a-cc-variable-exists"></a>

## Check if a CSS variable exists

In the document:
```html
<style>
.test {
	--testVar: 10;
}

.subTest {
	--anotherVar: 30;
}
</style>
...
<div class="test">
	<div class="subTest"></div>
</div>
```

```js
import {cssVars} from 'nuffjs';

const element = document.querySelector('.test');
const subElement = document.querySelector('.subTest');

console.log(cssVars(element).has('testVar')); // true
console.log(cssVars(element).has('--testVar')); // true
console.log(cssVars(element).has('anotherVar')); // false
console.log(cssVars(subElement).has('testVar')); // true
console.log(cssVars(subElement).has('anotherVar')); // true
element.style.setProperty('--whatever', 10);
console.log(cssVars(element).has('whatever')); // true

// it could also be stored for convenience
const vars = cssVars(element);

console.log(vars.has('testVar')); // true
console.log(vars.has('anotherVar')); // false

```

<a id="read-css-variables"></a>

## Read CSS variables

In the document:
```html
<style>
.test {
	--testVar: 666;
	--stringVar: this is a string;
}

.subTest {
	--testVar: '[6,  7]';
	--anotherVar:  {"a":"AAA","b":"BBB"};
}
</style>
...
<div class="test">
	<div class="subTest"></div>
</div>
```

```js
import {cssVars} from 'nuffjs';

const element = document.querySelector('.test');
const subElement = document.querySelector('.subTest');

const vars = cssVars(element);
const subVars = cssVars(subElement);

console.log(vars.get('testVar') + 1); // 667
console.log(vars.get('stringVar')); // 'this is a string'
console.log(subVars.get('testVar')[1]); // 7
console.log(subVars.get('anotherVar').b); // 'BBB'

// read values as is, getting strings
console.log(vars.getString('testVar')); // '666'
console.log(subVars.getString('testVar')); // '[6,  7]'
```

<a id="write-css-variables"></a>

## Write CSS variables

```js
import {cssVars} from 'nuffjs';

const element = document.createElement('div');

const vars = cssVars(element);

// set single value
vars.set('testNumber', 666);
// <div style="--testNumber: 666;"></div>
vars.set('testArray', [0, 1]);
// <div style="--testNumber: 666; --testArray: [0,1];"></div>

// set a group of values
vars.set({
	testNumber: 222,
	testBool: false
});
// <div style="--testNumber: 222; --testArray: [0,1]; --testBool: false;"></div>
```

<a id="remove-css-variables"></a>

## Remove CSS variables

Please be aware that the library can remove CSS variables only from the inline style attribute. It
cannot remove variables set by a separated CSS file or by a `<style>` element.

In the document:
```html
<div id="test" style="--testNumber: 222; --testArray: [0,1]; --testBool: false;"></div>
```

```js
import {cssVars} from 'nuffjs';

const element = document.querySelector('#test');
const vars = cssVars(element);

vars.remove('testNumber');
// <div id="test" style="--testArray: [0,1]; --testBool: false;"></div>

vars.remove('testArray');
// <div id="test" style="--testBool: false;"></div>

vars.remove('testBool');
// <div id="test" style=""></div>
```


<a id="extend"></a>

## Extend the base class

```js
import {CssVars} from 'nuffjs';

class MyCssVars extends CssVars {}


```
