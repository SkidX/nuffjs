# dataset 

Small utility to deal with data-attributes taking a namespace or prefix into account.
It also takes care of type casting the values.

- [Setup](#setup)
- [Import](#import)
- [Setting the namespace](#setting-the-namespace)
- [Check if a data-attribute exists](#check-if-a-data-attribute-exists)
- [Read data-attributes](#read-data-attributes)
- [Write data-attributes](#write-data-attributes)
- [ Remove data-attributes](#remove-data-attributes)
- [Query elements using data-attribute selectors](#query-elements)
- [Extend the base class](#extend)

<a id="setup"></a>

## Setup

```
npm install --save nuffjs;
```

<a id="import"></a>

## Import

```js
import {dataset} from 'nuffjs';
```


<a id="setting-the-namespace"></a>

## Setting the namespace

```js
import {dataset} from 'nuffjs';

// these two are equivalents:
dataset.setNs('acme');
dataset.setNs('acme-');


// read a previously set namespace
console.log(dataset.getNs()); // 'acme'
```

<a id="check-if-a-data-attribute-exists"></a>

## Check if a data-attribute exists

Somewhere in the document:
```html
<div id="test" data-aaa-test-number="15" data-bbb-test-bool="false" data-acme-test-string="acme"></div>
```

```js
import {dataset} from 'nuffjs';

dataset.setNs('acme');

const element = document.querySelector('#test');

console.log(dataset(element).has('aaaTestNumber')); // false
console.log(dataset(element).has('bbb-test-bool')); // false
console.log(dataset(element).has('testString')); // true

// it could also be stored for convenience
const ds = dataset(element);

console.log(ds.has('testNumber')); // false
console.log(ds.has('testBool')); // false
console.log(ds.has('testString')); // true

// temporarily overriding the global namespace 
console.log(dataset(element, '').has('aaaTestNumber'));	// true
console.log(dataset(element, 'aaa').has('testNumber'));	// true
console.log(dataset(element, 'bbb').has('testBool')); // true
console.log(dataset(element).has('testString')); // true
```


<a id="read-data-attributes"></a>

## Read data-attributes

Somewhere in the document:
```html
<div id="test" 
	data-aaa-test-number="15"
	data-acme-test-number="666"
	data-acme-test-bool="false"
	data-acme-test-string="acme"
	data-acme-test-array="[6,7,8]"
	data-acme-test-obj='{"prop":"test"}'
></div>
```

```js
import {dataset} from 'nuffjs';

const element = document.querySelector('#test');
dataset.setNs('acme');
const ds = dataset(element);

// read single values 
console.log(ds.get('testNumber')); // 666
console.log(ds.get('testString')); // 'acme'
console.log(ds.get('testBool') === false); // true
console.log(ds.get('testArray')[1] === 7); // true
console.log(ds.get('testObj').prop === 'test'); // true

// read values as is, getting strings
console.log(ds.getString('testNumber')); // '666'
console.log(ds.getString('testBool') === 'false'); // true
console.log(ds.getString('testArray')); // '[6,7,8]'
console.log(ds.getString('testObj')); // '{"prop":"test"}'

// read value with fallback
console.log(ds.get('whatever', 123)); // 123

// read all values
const data = ds.get();
console.log(data.testNumber); // 666
console.log(data.testBool === false); // true
console.log(data.testArray[1] === 7); // true
console.log('whatever' in data); // false

// read all with defaults values
const allData = ds.get({
	whatever: 456,
});
console.log(allData.testNumber); // 666
console.log('whatever' in allData); // true
console.log(allData.whatever); // 456

```

<a id="write-data-attributes"></a>

## Write data-attributes

```js
import {dataset} from 'nuffjs';

const element = document.createElement('div');
dataset.setNs('acme');
const ds = dataset(element);

ds.set('test', -4.5);
// <div data-acme-test-number="-4.5"></div>

ds.set('testArray', [0, 1]);
// <div data-acme-test="-4.5" data-acme-test-array="[0,1]"></div>

ds.set('testObj', {prop: 666});
// <div data-acme-test="-4.5" data-acme-test-array="[0,1]" data-acme-test-obj="{&quot;prop&quot;:666}"></div>

ds.set('test', false);
// <div data-acme-test="false" data-acme-test-array="[0,1]" data-acme-test-obj="{&quot;prop&quot;:666}"></div>

// setting value with a different namespace
dataset(element, '').set('test', 1);
// <div data-acme-test="false" data-acme-test-array="[0,1]" data-acme-test-obj="{&quot;prop&quot;:666}" data-test="1"></div>

// set a group of values
ds.set({
	testArray: [],
	testObj: {},
	value: 2
});
// <div data-acme-test="false" data-acme-test-array="[]" data-acme-test-obj="{}" data-acme-value="2" data-test="1"></div>
```


<a id="remove-data-attributes"></a>

## Remove data-attributes

Somewhere in the document:
```html
<div id="test" 
	data-aaa-test-number="15"
	data-acme-test-number="666"
	data-acme-test-bool="false"
></div>
```

```js
import {dataset} from 'nuffjs';

const element = document.querySelector('#test');
dataset.setNs('acme');
const ds = dataset(element);

ds.remove('testNumber');
// <div data-aaa-test-number="15" data-acme-test-bool="false"></div>

ds.remove('testBool');
// <div data-aaa-test-number="15"></div>

ds.remove('testNumber'); // does nothing, that data attribute has a different prefix
// <div data-aaa-test-number="15"></div>

console.log(ds.get()); // {}
```

<a id="query-elements"></a>

## Query elements using data-attribute selectors

```js
import {dataset} from 'nuffjs';

dataset.setNs('acme');

// getting an attribute name
console.log(dataset.attrName('testValueX')); // 'data-acme-test-value-x'
console.log(dataset.attrName('testValueX', 'xyz')); // 'data-xyz-test-value-x'

// getting a selector
console.log(dataset.selector('testValueX')); // '[data-acme-test-value-x]'
console.log(dataset.selector('testValueX', 666)); // '[data-acme-test-value-x="666"]'
```


<a id="extend"></a>

## Extend the base class

```js
import {Dataset} from 'nuffjs';

class MyDataset extends Dataset {}


```
