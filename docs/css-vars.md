# Classes

<dl>
<dt><a href="#CssVars">CssVars</a></dt>
<dd><p>CssVars objects allow to read / write CSS variables (custom properties) for the given element
(and eventual pseudo-element)</p>
</dd>
</dl>

# Functions

<dl>
<dt><a href="#cssVars">cssVars(element, [pseudoElement])</a> ⇒ <code><a href="#CssVars">CssVars</a></code></dt>
<dd><p>Returns a CssVars object for a given element and optional pseudo-element, using a cache to avoid
unnecessary object creation (when called with the same element and pseudo-element, it will always
return the same object)</p>
</dd>
</dl>


<br><a name="CssVars"></a>

# CssVars
> CssVars objects allow to read / write CSS variables (custom properties) for the given element> (and eventual pseudo-element)


* [CssVars](#CssVars)
    * [new CssVars(element, [pseudoElement])](#new_CssVars_new)
    * _instance_
        * [.has(name)](#CssVars+has) ⇒ <code>boolean</code>
        * [.get(name, [fallbackValue])](#CssVars+get) ⇒ <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array</code> \| <code>object</code> \| <code>null</code>
        * [.getString(name, [fallbackValue])](#CssVars+getString) ⇒ <code>string</code>
        * [.set(name, [value])](#CssVars+set)
        * [.remove(name)](#CssVars+remove)
    * _static_
        * [.encode(value)](#CssVars.encode) ⇒ <code>string</code>
        * [.decode(value)](#CssVars.decode) ⇒ <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array</code> \| <code>object</code> \| <code>null</code>


<br><a name="new_CssVars_new"></a>

## new CssVars(element, [pseudoElement])
> Creates an instance of CssVars.


| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | the element for which we are creating the instance |
| [pseudoElement] | <code>string</code> | the optional pseudo-element. Examples: ':before', ':after', ':marker' |


<br><a name="CssVars+has"></a>

## cssVars.has(name) ⇒ <code>boolean</code>
> Checkes if the given variable name has been set for the given element. A variable is> considered to be set when the value is different from an empty string


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the variable to be checked. It does not require the '--' at the beginning. |


<br><a name="CssVars+get"></a>

## cssVars.get(name, [fallbackValue]) ⇒ <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array</code> \| <code>object</code> \| <code>null</code>
> Gets the value of a variable (cast to a suitable standard type) or the given fallbackValue> (or an empty string) when the variable is not set

**Returns**: <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array</code> \| <code>object</code> \| <code>null</code> - the variable value or the fallbackValueor an empty string when the variable is not set  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the variable to be read. It does not require the '--' at the beginning. |
| [fallbackValue] | <code>string</code>, <code>number</code>, <code>boolean</code>, <code>Array</code>, <code>object</code>, <code>null</code> | when the variable is not set this fallbackValue will be returned |


<br><a name="CssVars+getString"></a>

## cssVars.getString(name, [fallbackValue]) ⇒ <code>string</code>
> Exactly like the [get() method](#CssVars+get), but without casting the value type, it> will be returned as string

**Returns**: <code>string</code> - the variable value as a string or the fallbackValue or an empty string whenthe variable is not set  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the variable to be read. It does not require the '--' at the beginning. |
| [fallbackValue] | <code>string</code> | when the variable is not set this fallbackValue will be returned |


<br><a name="CssVars+set"></a>

## cssVars.set(name, [value])
> Sets one or more CSS variables. Plain objects and arrays are stored in their JSON> representation


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code>, <code>object</code> | the name of the variable to be set or a plain object containing multiple name-value entries to be set. The names can be expressed without the '--', it will be added automatically. |
| [value] | <code>string</code>, <code>number</code>, <code>boolean</code>, <code>Array</code>, <code>object</code>, <code>null</code> | The value to be set when the name is a string |


<br><a name="CssVars+remove"></a>

## cssVars.remove(name)
> Removes a variable previously set with JS or in the inline style attribute. It cannot remove> a variable set by a separated CSS file or by a <style> element.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the variable to be removed. It does not require the '--' at the beginning. |


<br><a name="CssVars.encode"></a>

## CssVars.encode(value) ⇒ <code>string</code>
> Cast values to strings. Used before storing the values in the CSS variable

**Returns**: <code>string</code> - the string representation of the given value  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code>, <code>number</code>, <code>boolean</code>, <code>Array</code>, <code>object</code>, <code>null</code> | the value to be cast |


<br><a name="CssVars.decode"></a>

## CssVars.decode(value) ⇒ <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array</code> \| <code>object</code> \| <code>null</code>
> Try to cast a value expressed as string to a more suitable standard type

**Returns**: <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array</code> \| <code>object</code> \| <code>null</code> - The value after the cast  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | the string value to be converted |


<br><a name="cssVars"></a>

# cssVars(element, [pseudoElement]) ⇒ [<code>CssVars</code>](#CssVars)
> Returns a CssVars object for a given element and optional pseudo-element, using a cache to avoid> unnecessary object creation (when called with the same element and pseudo-element, it will always> return the same object)

**Returns**: [<code>CssVars</code>](#CssVars) - a CssVars object for the given element and pseudo-element  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>Element</code> |  | the element for which we are creating the instance |
| [pseudoElement] | <code>string</code> | <code>null</code> | the optional pseudo-element. Examples: ':before', ':after', ':marker' |

