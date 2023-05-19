# Classes

<dl>
<dt><a href="#ClassList">ClassList</a></dt>
<dd><p>It provides methods for manipulating and accessing the classList of an Element, with support for
namespaces. API almost completely equivalent to Element.classList.</p>
</dd>
</dl>

# Functions

<dl>
<dt><a href="#classList">classList(element, [ns])</a> ⇒ <code><a href="#ClassList">ClassList</a></code></dt>
<dd><p>Returns a ClassList object for a given element and namespace, using a cache to avoid unnecessary
object creation (when called with the same element and namespace, it will always return the same
object).</p>
</dd>
</dl>


<br><a name="ClassList"></a>

# ClassList
> It provides methods for manipulating and accessing the classList of an Element, with support for> namespaces. API almost completely equivalent to Element.classList.

**See**: [DOMTokenList](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList)  

* [ClassList](#ClassList)
    * [new ClassList(element, [ns])](#new_ClassList_new)
    * [.length](#ClassList+length) : <code>number</code>
    * [.value](#ClassList+value) : <code>string</code>
    * [.add(...classes)](#ClassList+add)
    * [.remove(...classes)](#ClassList+remove)
    * [.contains(name)](#ClassList+contains) ⇒ <code>boolean</code>
    * [.toggle(name, [force])](#ClassList+toggle) ⇒ <code>boolean</code>
    * [.replace(oldClass, newClass)](#ClassList+replace) ⇒ <code>boolean</code>
    * [.values()](#ClassList+values) ⇒ <code>array</code>
    * [.keys()](#ClassList+keys) ⇒ <code>array</code>
    * [.entries()](#ClassList+entries) ⇒ <code>array</code>
    * [.item(index)](#ClassList+item) ⇒ <code>string</code>
    * [.forEach(callback, [context])](#ClassList+forEach)


<br><a name="new_ClassList_new"></a>

## new ClassList(element, [ns])
> Creates an instance of ClassList.


| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | the element for which we are creating the instance |
| [ns] | <code>string</code> | optional namespace. If specified, it will be put at the beginning of every class name set through this class. If not specified, a global one previously set will be used. |


<br><a name="ClassList+length"></a>

## classList.length : <code>number</code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🔒 Read only`_

> Getter equivalent to Element.classList.length, but taking the namespace into account. Gets> the number of class names that start with the specified namespace.

**See**: [DOMTokenList:length](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/length)  

<br><a name="ClassList+value"></a>

## classList.value : <code>string</code>
> Getter / Setter equivalent to Element.classList.value, but taking the namespace into account.

**See**: [DOMTokenList:value](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/value)  

<br><a name="ClassList+add"></a>

## classList.add(...classes)
> Equivalent to Element.classList.add(), but taking the namespace into account.

**See**: [DOMTokenList:add()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/add)  

| Param | Type | Description |
| --- | --- | --- |
| ...classes | <code>string</code> | one or more class names |

**Example** *(Adding classes)*  
``` javascript
import {classList} from 'nuff';
classList.cs = 'acme-';
const element = document.createElement('div');
const cs = classList(element);
cs.add('test'); // adds 'acme-test'
cs.add('one', 'two', 'three'); // adds 'acme-one', 'acme-two', 'acme-three'
```

<br><a name="ClassList+remove"></a>

## classList.remove(...classes)
> Equivalent to Element.classList.remove(), but taking the namespace into account.

**See**: [DOMTokenList:remove()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/remove)  

| Param | Type | Description |
| --- | --- | --- |
| ...classes | <code>string</code> | one or more class names |


<br><a name="ClassList+contains"></a>

## classList.contains(name) ⇒ <code>boolean</code>
> Equivalent to Element.classList.contains(), but taking the namespace into account.

**Returns**: <code>boolean</code> - true if the given class name is set on the element, false otherwise  
**See**: [DOMTokenList:contains()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/contains)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the class name to check |


<br><a name="ClassList+toggle"></a>

## classList.toggle(name, [force]) ⇒ <code>boolean</code>
> Equivalent to Element.classList.toggle(), but taking the namespace into account.

**Returns**: <code>boolean</code> - true when the class name is present after the call, false otherwise  
**See**: [DOMTokenList:toggle()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the class name to be toggled |
| [force] | <code>boolean</code> | a flag to force the add or remove of the class name |


<br><a name="ClassList+replace"></a>

## classList.replace(oldClass, newClass) ⇒ <code>boolean</code>
> Equivalent to Element.classList.replace(), but taking the namespace into account.

**Returns**: <code>boolean</code> - true if oldToken was successfully replaced, or false if not.  
**See**: [DOMTokenList:replace()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace)  

| Param | Type | Description |
| --- | --- | --- |
| oldClass | <code>string</code> | the class name to be replaced |
| newClass | <code>string</code> | the class name replacement |


<br><a name="ClassList+values"></a>

## classList.values() ⇒ <code>array</code>
> Equivalent to Element.classList.values(), but taking the namespace into account.

**Returns**: <code>array</code> - the iterable array of class names that match with the namespace  
**See**: [DOMTokenList:values()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/values)  

<br><a name="ClassList+keys"></a>

## classList.keys() ⇒ <code>array</code>
> Equivalent to Element.classList.keys(), but taking the namespace into account.

**Returns**: <code>array</code> - the list of indexes, based on the class names list that match with thenamespace  
**See**: [DOMTokenList:keys()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/keys)  

<br><a name="ClassList+entries"></a>

## classList.entries() ⇒ <code>array</code>
> Equivalent to Element.classList.entries(), but taking the namespace into account.

**Returns**: <code>array</code> - the iterable list of [index, class name] built with class names that matchthe namespace  
**See**: [DOMTokenList:entries()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/entries)  

<br><a name="ClassList+item"></a>

## classList.item(index) ⇒ <code>string</code>
> Equivalent to Element.classList.item(), but taking the namespace into account.

**Returns**: <code>string</code> - the class name at the specified index or null when the index is out ofrange  
**See**: [DOMTokenList:item()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/item)  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | the index of the class name, taking into account only those that match with the namespace |


<br><a name="ClassList+forEach"></a>

## classList.forEach(callback, [context])
> Equivalent to Element.classList.forEach(), but taking the namespace into account.

**See**: [DOMTokenList:forEach()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/forEach)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The function to execute for each element |
| [context] | <code>object</code> | The value to use as *this* when executing callback |


<br><a name="classList"></a>

# classList(element, [ns]) ⇒ [<code>ClassList</code>](#ClassList)
> Returns a ClassList object for a given element and namespace, using a cache to avoid unnecessary> object creation (when called with the same element and namespace, it will always return the same> object).

**Returns**: [<code>ClassList</code>](#ClassList) - a ClassList object for the given element and namespace  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | the element for which we are creating the instance |
| [ns] | <code>string</code> | optional namespace. If specified, it will be put at the beginning of every class name set through the class. If not specified, a global one previously set will be used. |


* [classList(element, [ns])](#classList) ⇒ [<code>ClassList</code>](#ClassList)
    * [.getNs()](#classList.getNs) ⇒ <code>string</code>
    * [.setNs(value)](#classList.setNs)
    * [.selector(name, [ns])](#classList.selector) ⇒ <code>string</code>
    * [.className(name, [ns])](#classList.className) ⇒ <code>string</code>


<br><a name="classList.getNs"></a>

## classList.getNs() ⇒ <code>string</code>
> Gets the global namespace


<br><a name="classList.setNs"></a>

## classList.setNs(value)
> Sets the global namespace


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | the new namespace |


<br><a name="classList.selector"></a>

## classList.selector(name, [ns]) ⇒ <code>string</code>
> Returns a CSS selector for the given class names, adding the namespace to them

**Returns**: <code>string</code> - the generated CSS selector  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code>, <code>Array</code> | class name or array of class names |
| [ns] | <code>string</code> | optional namespace. If specified, it will be put at the beginning of every class name. If not specified, a global one previously set will be used. |


<br><a name="classList.className"></a>

## classList.className(name, [ns]) ⇒ <code>string</code>
> Returns a class name after adding the namespace to it.

**Returns**: <code>string</code> - the class name starting with the namespace  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | class name |
| [ns] | <code>string</code> | optional namespace. If specified, it will be put at the beginning of the class name. If not specified, a global one previously set will be used. |

