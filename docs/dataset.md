# Classes

<dl>
<dt><a href="#Dataset">Dataset</a></dt>
<dd><p>Dataset objects allow to do typical CRUD operations on an element&#39;s data attributes, with support
for a namespace</p>
</dd>
</dl>

# Functions

<dl>
<dt><a href="#dataset">dataset(element, [ns])</a> ⇒ <code><a href="#Dataset">Dataset</a></code></dt>
<dd><p>Returns a Dataset object for a given element and namespace, using a cache to avoid unnecessary
object creation (when called with the same element and namespace, it will always return the same
object)</p>
</dd>
</dl>


<br><a name="Dataset"></a>

# Dataset
> Dataset objects allow to do typical CRUD operations on an element's data attributes, with support> for a namespace


* [Dataset](#Dataset)
    * [new Dataset(element, [ns])](#new_Dataset_new)
    * _instance_
        * [.has(name)](#Dataset+has) ⇒ <code>boolean</code>
        * [.get([name], [fallbackValue])](#Dataset+get) ⇒ <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array</code> \| <code>object</code> \| <code>null</code>
        * [.getString([name], [fallbackValue])](#Dataset+getString) ⇒ <code>string</code> \| <code>object</code> \| <code>null</code>
        * [.set(name, [value])](#Dataset+set)
        * [.remove(name)](#Dataset+remove)
    * _static_
        * [.encode(value)](#Dataset.encode) ⇒ <code>string</code>
        * [.decode(value)](#Dataset.decode) ⇒ <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array</code> \| <code>object</code> \| <code>null</code>


<br><a name="new_Dataset_new"></a>

## new Dataset(element, [ns])
> Creates an instance of Dataset


| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | the element for which we are creating the instance |
| [ns] | <code>string</code> | optional namespace. If specified, it will be put at the beginning of every class name set through this class. If not specified, a global one previously set will be used. |


<br><a name="Dataset+has"></a>

## dataset.has(name) ⇒ <code>boolean</code>
> Gives true if the data attribute with the given name (after applying an eventual namespace)> exists on the element


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the attribute. It accept names expressed also in camelCase, it will internally be converted to proper data attribute name. |


<br><a name="Dataset+get"></a>

## dataset.get([name], [fallbackValue]) ⇒ <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array</code> \| <code>object</code> \| <code>null</code>
> Retrieve a data attribute value or all of them as long as they match the previously set> namespace. Returned values are casted to the proper type among boolean, numbers, array and> object (when they are encoded as JSON)

**Returns**: <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array</code> \| <code>object</code> \| <code>null</code> - the retrieved value or values aftercasting them in the proper type or the fallbackValue  

| Param | Type | Description |
| --- | --- | --- |
| [name] | <code>string</code>, <code>object</code> | When a string value is passed, it returns the the value of that attribute after applying the namespace. Name passed in camelCase are supported. If the attribute is not set it returns the eventual fallbackValue passed as a second parameter, or null otherwise. When no value is passed, it returns all data attributes values that match with the set namespace. When a plain object is passed, it is used as a set of default values: in will return all the values that match the namespace when they are available or the given default values |
| [fallbackValue] | <code>\*</code> | When a string name is passed and that attribute is not present, this fallbackValue will be returned |


<br><a name="Dataset+getString"></a>

## dataset.getString([name], [fallbackValue]) ⇒ <code>string</code> \| <code>object</code> \| <code>null</code>
> Exactly like the [get() method](#Dataset+get), but without casting the value types, they> will be returned as string

**Returns**: <code>string</code> \| <code>object</code> \| <code>null</code> - the retrieved value or values as stringsor the fallbackValue.  

| Param | Type | Description |
| --- | --- | --- |
| [name] | <code>string</code>, <code>object</code> | @see [get() method](#Dataset+get) |
| [fallbackValue] | <code>\*</code> | [get() method](#Dataset+get) |


<br><a name="Dataset+set"></a>

## dataset.set(name, [value])
> Sets one or more data attributes values, after applying the namespace to their name. Plain> objects and arrays are stored in their JSON representation


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code>, <code>object</code> | the name of the data attribute to be set or a plain object containing multiple name-value entries to be set. The names can be expressed in camelCase and the eventual namespace will be added before setting them |
| [value] | <code>string</code>, <code>number</code>, <code>boolean</code>, <code>Array</code>, <code>object</code>, <code>null</code> | The value to be set when the name is a string |


<br><a name="Dataset+remove"></a>

## dataset.remove(name)
> Remove a data attribute, after applying the eventual namespace to the name


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the attribute to be removed. Can be expressed in camelCase format. |


<br><a name="Dataset.encode"></a>

## Dataset.encode(value) ⇒ <code>string</code>
> Cast values to strings. Used before storing the values in the data attributes

**Returns**: <code>string</code> - the string representation of the given value  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code>, <code>number</code>, <code>boolean</code>, <code>Array</code>, <code>object</code>, <code>null</code> | the value to be cast |


<br><a name="Dataset.decode"></a>

## Dataset.decode(value) ⇒ <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array</code> \| <code>object</code> \| <code>null</code>
> Try to cast a value expressed as string to a more suitable standard type

**Returns**: <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array</code> \| <code>object</code> \| <code>null</code> - The value after the cast  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | the string value to be converted |


<br><a name="dataset"></a>

# dataset(element, [ns]) ⇒ [<code>Dataset</code>](#Dataset)
> Returns a Dataset object for a given element and namespace, using a cache to avoid unnecessary> object creation (when called with the same element and namespace, it will always return the same> object)

**Returns**: [<code>Dataset</code>](#Dataset) - a Dataset object for the given element and namespace  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | the element for which we are creating the instance |
| [ns] | <code>string</code> | optional namespace. If specified, it will be put at the beginning of every data attribute name set through the class. If not specified, a global one previously set will be used. |


* [dataset(element, [ns])](#dataset) ⇒ [<code>Dataset</code>](#Dataset)
    * [.getNs()](#dataset.getNs) ⇒ <code>string</code>
    * [.setNs(value)](#dataset.setNs)
    * [.selector(name, [value], [ns])](#dataset.selector) ⇒ <code>string</code>
    * [.attrName(name, [value], [ns])](#dataset.attrName) ⇒ <code>string</code>


<br><a name="dataset.getNs"></a>

## dataset.getNs() ⇒ <code>string</code>
> Gets the global namespace


<br><a name="dataset.setNs"></a>

## dataset.setNs(value)
> Sets the global namespace


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | the new namespace |


<br><a name="dataset.selector"></a>

## dataset.selector(name, [value], [ns]) ⇒ <code>string</code>
> Returns a CSS selector in the form [data-ns-name] or [data-ns-name="value"] for the given> attribute name and value, taking into account the namespace.

**Returns**: <code>string</code> - the generated CSS selector  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | data attribute name for the selector. It accepts also names in camelCase |
| [value] | <code>string</code>, <code>number</code>, <code>boolean</code>, <code>Array</code>, <code>object</code>, <code>null</code> | the optional value to be used in the selector, to generate a form . It gets converted to string |
| [ns] | <code>string</code> | optional namespace. If specified, it will be put at the beginning of the data attribute name class name. If not specified, a global one previously set will be used. |


<br><a name="dataset.attrName"></a>

## dataset.attrName(name, [value], [ns]) ⇒ <code>string</code>
> Returns a data attribute name for the given name, taking into account the namespace.

**Returns**: <code>string</code> - the generated attribute name in the form data-ns-name  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | accepts also names in camelCase |
| [value] | <code>string</code>, <code>number</code>, <code>boolean</code>, <code>Array</code>, <code>object</code>, <code>null</code> | the optional value to be used in the selector, to generate a form . It gets converted to string. |
| [ns] | <code>string</code> | optional namespace. If specified, it will be put at the beginning of the data attribute name. If not specified, a global one previously set will be used. |

