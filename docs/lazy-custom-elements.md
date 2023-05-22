# Classes

<dl>
<dt><a href="#LazyCustomElementRegistry">LazyCustomElementRegistry</a></dt>
<dd><p>The LazyCustomElementRegistry class is a custom element registry for defining and upgrading
custom elements in a lazy manner.</p>
</dd>
</dl>

# Constants

<dl>
<dt><a href="#lazyCustomElements">lazyCustomElements</a> : <code><a href="#LazyCustomElementRegistry">LazyCustomElementRegistry</a></code></dt>
<dd><p>A shared instance of LazyCustomElementRegistry</p>
</dd>
</dl>


<br><a name="LazyCustomElementRegistry"></a>

# LazyCustomElementRegistry
> The LazyCustomElementRegistry class is a custom element registry for defining and upgrading
> custom elements in a lazy manner.


* [LazyCustomElementRegistry](#LazyCustomElementRegistry)
    * [new LazyCustomElementRegistry()](#new_LazyCustomElementRegistry_new)
    * [.define(name, constructor, [options])](#LazyCustomElementRegistry+define) ⇒ [<code>LazyCustomElementRegistry</code>](#LazyCustomElementRegistry)
    * [.get(name)](#LazyCustomElementRegistry+get) ⇒ <code>Promise.&lt;(function()\|undefined)&gt;</code>
    * [.upgrade(root)](#LazyCustomElementRegistry+upgrade)
    * [.whenDefined(name)](#LazyCustomElementRegistry+whenDefined) ⇒ <code>Promise</code>
    * [.upgradeElement(element)](#LazyCustomElementRegistry+upgradeElement)
    * [.upgradeElements(elements)](#LazyCustomElementRegistry+upgradeElements)
    * [.querySelector(node, selectors)](#LazyCustomElementRegistry+querySelector) ⇒ <code>Promise.&lt;?Element&gt;</code>
    * [.querySelectorAll(node, selectors)](#LazyCustomElementRegistry+querySelectorAll) ⇒ <code>Promise.&lt;?NodeList&gt;</code>
    * [.createElement(tagName, [options])](#LazyCustomElementRegistry+createElement) ⇒ <code>Element</code>
    * [.setOptions(options)](#LazyCustomElementRegistry+setOptions)
    * [.getOptions()](#LazyCustomElementRegistry+getOptions) ⇒ <code>object</code>
    * [.getDefaultOptions()](#LazyCustomElementRegistry+getDefaultOptions) ⇒ <code>object</code>


<br><a name="new_LazyCustomElementRegistry_new"></a>

## new LazyCustomElementRegistry()
> Creates an instance of LazyCustomElementRegistry.


<br><a name="LazyCustomElementRegistry+define"></a>

## lazyCustomElementRegistry.define(name, constructor, [options]) ⇒ [<code>LazyCustomElementRegistry</code>](#LazyCustomElementRegistry)
> Equivalent of customElements.define() but supporting async definition and additional
> features. Define a custom element or custom built-in element, potentially in a lazy way, by
> passing an async callback that resolve to the Class

**Returns**: [<code>LazyCustomElementRegistry</code>](#LazyCustomElementRegistry) - return itself to allow for chain calls  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | The name of the custom element being defined, or a partial name ending with a dash in case of late definition of custom built-in elements classes from a mixin, see options.extends description. |
| constructor | <code>function</code> |  | The constructor function or class for the custom element being defined, or an async function that will resolve to the constructor. For |
| [options] | <code>object</code> | <code>{}</code> | An optional object containing configuration options for the custom element being defined. It may override some of the global options. |
| [options.extends] | <code>string</code>, <code>Array</code> |  | the tagName of the built-in element to be extended. It allows to specify an array of names or the string '*' supporting the late definition of the class from a mixin in the form: const ClassName = (Base) => class extends Base {}. In that case the element name needs to be defined in a partial form with a trailing dash like 'acme-my-element-'. The final name of the elements will be completed adding the built-in element name that are going to be extended, like: 'acme-my-element-button', 'acme-my-element-a' and so on. |
| [options.selector] | <code>string</code> |  | an alternative selector to identify custom elements in the dom in order to observe them for lazy defining and lazy loading. By default it will use the component name or a data attribute selector [is] for custom built-in elements |
| [options.autodefineAttribute] | <code>string</code> | <code>&quot;data-autodefine&quot;</code> | attribute name (usually a data-attribute) to control the autodefinition behavior on the defined custom elements. Valid attribute values are 'true' (will be defined as soon as it is intercepted in the DOM), 'lazy' or an alternative value defined in options.lazyValue (will be defined when one element of this type intercepts a defined area around the viewport) or 'false' (will not be defined automatically, it will require an upgrade call to force the definition) |
| [options.lazyValue] | <code>string</code> | <code>&quot;lazy&quot;</code> | value used to define the lazy behavior (both for autodefine and autoload features) |
| [options.autodefineRoot] | <code>Document</code>, <code>HTMLElement</code> | <code>document</code> | root used for the autodefine IntersectionObserver |
| [options.autodefineRootMargin] | <code>string</code> | <code>&quot;100% 0px 100% 0px&quot;</code> | margin used for the autodefine IntersectionObserver. By default it has a 100% height margin both above and below the viewport |
| [options.autodefineThreshold] | <code>number</code> | <code>0</code> | threshold used for the autodefine IntersectionObserver |
| [options.autodefineDefaultValue] | <code>string</code> | <code>&quot;lazy&quot;</code> | the default value for the autodefine attribute |
| [options.autoloadRoot] | <code>Document</code>, <code>HTMLElement</code> | <code>document</code> | root used for the autoload IntersectionObserver |
| [options.autoloadRootMargin] | <code>string</code> | <code>&quot;50% 0px 50% 0px&quot;</code> | margin used for the autoload IntersectionObserver. By default it has a 50% height margin both above and below the viewport |
| [options.autoloadThreshold] | <code>number</code> | <code>0</code> | threshold used for the autodefine IntersectionObserver |
| [options.autoloadAttribute] | <code>string</code> | <code>&quot;data-autoload&quot;</code> | attribute name (usually a data-attribute) to control the autoloading behavior on the defined custom elements. Valid attribute values are 'true' (will call the load method as soon as it is intercepted in the DOM), 'lazy', or an alternative value defined in options.lazyValue (will call the load method when the element is intercepted in a defined area around the viewport). Any other value will be ignored. Differently from the autodefine, elements that want to subscribe to the autoloading feature needs to have this attribute set. |
| [options.loadMethod] | <code>string</code> | <code>&quot;load&quot;</code> | Name of the method to be called when the load is triggered |
| [options.firstConnectedCallbackMethod] | <code>string</code>, <code>boolean</code> | <code>&quot;firstConnectedCallback&quot;</code> | if the custom element class contains this method, it will be called only the first time the elements are connected to the document instead of the connectedCallback() method, which instead will be called (if available) on every reconnection after the first one. An empty string or a falsy value can be passed to disable the feature when the class contains such a method but you don't want to subscribe to this automated behavior. |


<br><a name="LazyCustomElementRegistry+get"></a>

## lazyCustomElementRegistry.get(name) ⇒ <code>Promise.&lt;(function()\|undefined)&gt;</code>
> Async version of CustomElementRegistry.get method. Retrieve a previously defined constructor
> for a given custom element name. It resolves late definitions made from a mixin in the form:
> const ClassName = (Base) => class extends Base {}. It also implements (through subclassing)
> the logic to deal with a firstConnectedCallback() method when the feature is enabled and the
> method is available in the defined constructor.

**Returns**: <code>Promise.&lt;(function()\|undefined)&gt;</code> - resolves to a previously defined constructor or to
undefined  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the custom element or custom built-in element name associated to the constructor to retrieve |


<br><a name="LazyCustomElementRegistry+upgrade"></a>

## lazyCustomElementRegistry.upgrade(root)
> Async version of CustomElementRegistry.upgrade method. First it resolves all the lazy defined
> elements, then proceed to upgrade them.


| Param | Type | Description |
| --- | --- | --- |
| root | <code>Element</code> | the element to be upgraded, together with its descendants |


<br><a name="LazyCustomElementRegistry+whenDefined"></a>

## lazyCustomElementRegistry.whenDefined(name) ⇒ <code>Promise</code>
> Exact same feature as CustomElementRegistry.whenDefined.

**Returns**: <code>Promise</code> - resolves when the custom element constructor has been defined  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | a custom element or custom built-in element name |


<br><a name="LazyCustomElementRegistry+upgradeElement"></a>

## lazyCustomElementRegistry.upgradeElement(element)
> Same feature provided by [upgrade](#LazyCustomElementRegistry+upgrade) but without forcing the
> definition of lazy defined descendants.


| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | the element to be upgraded |


<br><a name="LazyCustomElementRegistry+upgradeElements"></a>

## lazyCustomElementRegistry.upgradeElements(elements)
> Same feature provided by [upgrade](#LazyCustomElementRegistry+upgrade) but for a list of elements
> and without forcing the definition of lazy defined descendants.


| Param | Type | Description |
| --- | --- | --- |
| elements | <code>Array</code>, <code>NodeList</code> | the elements to be upgraded |


<br><a name="LazyCustomElementRegistry+querySelector"></a>

## lazyCustomElementRegistry.querySelector(node, selectors) ⇒ <code>Promise.&lt;?Element&gt;</code>
> Async equivalent of node.querySelector() followed by forcing a definition of the eventually
> lazy defined custom element and an upgrade of the found element.

**Returns**: <code>Promise.&lt;?Element&gt;</code> - returns a promise that resolves with the found element or null  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Document</code>, <code>Element</code> | the document or node to be queried |
| selectors | <code>string</code> | a string containing one or more comma-separated selectors to match |


<br><a name="LazyCustomElementRegistry+querySelectorAll"></a>

## lazyCustomElementRegistry.querySelectorAll(node, selectors) ⇒ <code>Promise.&lt;?NodeList&gt;</code>
> Async equivalent of node.querySelectorAll() followed by forcing a definition of the
> eventually lazy defined custom elements and an upgrade of the found elements.

**Returns**: <code>Promise.&lt;?NodeList&gt;</code> - returns a promise that resolves with the found elements
NodeList or null in case the node is not an instance of Document or Element to be queried  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Document</code>, <code>Element</code> | the document or node to be queried |
| selectors | <code>string</code> | a string containing one or more comma-separated selectors to match |


<br><a name="LazyCustomElementRegistry+createElement"></a>

## lazyCustomElementRegistry.createElement(tagName, [options]) ⇒ <code>Element</code>
> It works exactly like document.createElement with a single additional feature to solve a
> weird thing. When the standard document.createElement is used to create a custom built-in
> element (passing an options object as a second parameter, with the "is" property filled), it
> set the is attribute in a way that is not properly queryable with the usual methods. Let's
> say you do something like:
> 
> ``` javascript
> class MyCustomParagraph extends HTMLParagraphElement {}
> customElements.define('my-custom-paragraph', MyCustomParagraph, {extends: 'p'});
> const p = document.createElement('p', {is: 'my-custom-paragraph});
> console.log(p.matches('[is="my-custom-paragraph"]'));
> // unexpectedly it prints false
> // same if you attach the element in the dom and try to query it by "is" attribute, you will get no results
> ```
> 
> So in those cases, this method forces a setAttribute call with the proper values that allows
> the element to be queryable as expected.

**Returns**: <code>Element</code> - the created Element  

| Param | Type | Description |
| --- | --- | --- |
| tagName | <code>string</code> | the tagName of the Element to be created |
| [options] | <code>undefined</code>, <code>object</code> | An optional object eventually containing the property is |
| [options.is] | <code>string</code> | The tagName of a custom built-in element |


<br><a name="LazyCustomElementRegistry+setOptions"></a>

## lazyCustomElementRegistry.setOptions(options)
> Sets / overwrites config options


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | An object containing configuration options |
| [options.autodefineAttribute] | <code>string</code> | <code>&quot;data-autodefine&quot;</code> | attribute name (usually a data-attribute) to control the autodefinition behavior on the defined custom elements. Valid attribute values are 'true' (will be defined as soon as it is intercepted in the DOM), 'lazy' or an alternative value defined in options.lazyValue (will be defined when one element of this type intercepts a defined area around the viewport) or 'false' (will not be defined automatically, it will require an upgrade call to force the definition) |
| [options.lazyValue] | <code>string</code> | <code>&quot;lazy&quot;</code> | value used to define the lazy behavior (both for autodefine and autoload features) |
| [options.autodefineRoot] | <code>Document</code>, <code>HTMLElement</code> | <code>document</code> | root used for the autodefine IntersectionObserver |
| [options.autodefineRootMargin] | <code>string</code> | <code>&quot;100% 0px 100% 0px&quot;</code> | margin used for the autodefine IntersectionObserver. By default it has a 100% height margin both above and below the viewport |
| [options.autodefineThreshold] | <code>number</code> | <code>0</code> | threshold used for the autodefine IntersectionObserver |
| [options.autodefineDefaultValue] | <code>string</code> | <code>&quot;lazy&quot;</code> | the default value for the autodefine attribute |
| [options.autoloadRoot] | <code>Document</code>, <code>HTMLElement</code> | <code>document</code> | root used for the autoload IntersectionObserver |
| [options.autoloadRootMargin] | <code>string</code> | <code>&quot;50% 0px 50% 0px&quot;</code> | margin used for the autoload IntersectionObserver. By default it has a 50% height margin both above and below the viewport |
| [options.autoloadThreshold] | <code>number</code> | <code>0</code> | threshold used for the autodefine IntersectionObserver |
| [options.autoloadAttribute] | <code>string</code> | <code>&quot;data-autoload&quot;</code> | attribute name (usually a data-attribute) to control the autoloading behavior on the defined custom elements. Valid attribute values are 'true' (will call the load method as soon as it is intercepted in the DOM), 'lazy', or an alternative value defined in options.lazyValue (will call the load method when the element is intercepted in a defined area around the viewport). Any other value will be ignored. Differently from the autodefine, elements that want to subscribe to the autoloading feature needs to have this attribute set. |
| [options.loadMethod] | <code>string</code> | <code>&quot;load&quot;</code> | Name of the method to be called when the load is triggered |
| [options.firstConnectedCallbackMethod] | <code>string</code>, <code>boolean</code> | <code>&quot;firstConnectedCallback&quot;</code> | if the custom element class contains this method, it will be called only the first time the elements are connected to the document instead of the connectedCallback() method, which instead will be called (if available) on every reconnection after the first one. An empty string or a falsy value can be passed to disable the feature when the class contains such a method but you don't want to subscribe to this automated behavior. |


<br><a name="LazyCustomElementRegistry+getOptions"></a>

## lazyCustomElementRegistry.getOptions() ⇒ <code>object</code>
> returns a copy of an the configuration options, to avoid accidental modification outside of the registry's scope.

**Returns**: <code>object</code> - a copy of the configuration options of the `options` object.  
**See**: [setOptions](#LazyCustomElementRegistry+setOptions) for the full list of the options.  

<br><a name="LazyCustomElementRegistry+getDefaultOptions"></a>

## lazyCustomElementRegistry.getDefaultOptions() ⇒ <code>object</code>
> returns a copy of an the default configuration options, to avoid accidental modification.

**Returns**: <code>object</code> - a copy of the default configuration options of the `options` object.  
**See**: [setOptions](#LazyCustomElementRegistry+setOptions) for the full list of the options.  

<br><a name="lazyCustomElements"></a>

# lazyCustomElements : [<code>LazyCustomElementRegistry</code>](#LazyCustomElementRegistry)
> A shared instance of LazyCustomElementRegistry

