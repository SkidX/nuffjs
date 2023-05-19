# Classes

<dl>
<dt><a href="#EventListener">EventListener</a></dt>
<dd><p>EventListener objects are thenable objects that allows to remove the listener and get a promise
resolved after the event has been dispatched.</p>
</dd>
<dt><a href="#WrappedEventTarget">WrappedEventTarget</a></dt>
<dd><p>Object that wraps another object (the event target) in order to call listen() or dispatch() event
without repeating the target every time.
May be practical if you needs to perform several event-related calls.</p>
</dd>
</dl>

# Functions

<dl>
<dt><a href="#listen">listen(target, types, [listener], [options])</a> ⇒ <code><a href="#EventListener">EventListener</a></code></dt>
<dd><p>Sets up an EventListener</p>
</dd>
<dt><a href="#dispatch">dispatch(target, type, [options])</a> ⇒ <code>Event</code></dt>
<dd><p>Dispaches an event for the given target</p>
</dd>
<dt><a href="#eventTarget">eventTarget(target)</a> ⇒ <code><a href="#WrappedEventTarget">WrappedEventTarget</a></code></dt>
<dd><p>Gives back a weakly cached WrappedEventTarget</p>
</dd>
</dl>


<br><a name="EventListener"></a>

# EventListener
> EventListener objects are thenable objects that allows to remove the listener and get a promise> resolved after the event has been dispatched.


* [EventListener](#EventListener)
    * [new EventListener(target, types, [listener], [options])](#new_EventListener_new)
    * [.then([callback])](#EventListener+then) ⇒ <code>Promise.&lt;Event&gt;</code>
    * [.unlisten()](#EventListener+unlisten)


<br><a name="new_EventListener_new"></a>

## new EventListener(target, types, [listener], [options])
> Creates an instance of EventListener.


| Param | Type | Description |
| --- | --- | --- |
| target | <code>object</code>, <code>EventTarget</code> | an EventTarget (or any other JS object) to listen for the event(s) |
| types | <code>string</code>, <code>Array.&lt;string&gt;</code> | a single event type or an array of event types or a space-separated list of event type. Example: 'click', ['mouseenter', 'mouseleave'], 'resize scroll'. |
| [listener] | <code>function</code>, <code>object</code> | a function or object that implement the handleEvent() method |
| [options] | <code>object</code>, <code>boolean</code> | contains the listening options. Accepts all the standrd options accepted by addEventListener - capture, once, passive, signal - plus three additional custom properties used to provide additional - non standard - features. |
| [options.selector] | <code>string</code> | used to implement event delegation. The listener will be called only when the event has been dispatched by elements nested in the target that match the selector. |
| [options.throttle] | <code>number</code>, <code>boolean</code> | when throttle is true, the requestAnimationFrame will be used to throttle the calls to the listeners. When it is a number, it will be used as milliseconds mimimum interval between the calls. The throttled listener is guaranteed to be called both with the first and the last event, while those in between may be ignored. The last call could be delayed in respect to the actual event moment. |
| [options.late] | <code>boolean</code> | when the late flag is true, the listener can be called (and the inner promise resolved) also if a 'late' event has been dispatched before setting up the listener. A late event is a CustomEvent dispatched by the [dispatch() function](#dispatch) setting the late option to true. |


<br><a name="EventListener+then"></a>

## eventListener.then([callback]) ⇒ <code>Promise.&lt;Event&gt;</code>
> Return a promise that resolves when the first listened event has been dispatched.

**Returns**: <code>Promise.&lt;Event&gt;</code> - the returned promise is resolved with the Event object.  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>function</code> | optional callback to be called after the promise's resolution. |


<br><a name="EventListener+unlisten"></a>

## eventListener.unlisten()
> Remove the event(s) listener(s).


<br><a name="WrappedEventTarget"></a>

# WrappedEventTarget
> Object that wraps another object (the event target) in order to call listen() or dispatch() event> without repeating the target every time.> May be practical if you needs to perform several event-related calls.


* [WrappedEventTarget](#WrappedEventTarget)
    * [new WrappedEventTarget(target)](#new_WrappedEventTarget_new)
    * [.listen()](#WrappedEventTarget+listen)
    * [.dispatch()](#WrappedEventTarget+dispatch)


<br><a name="new_WrappedEventTarget_new"></a>

## new WrappedEventTarget(target)
> Creates an instance of WrappedEventTarget.


| Param | Type | Description |
| --- | --- | --- |
| target | <code>object</code>, <code>EventTarget</code> | an EventTarget (or any other JS object) that can dispatch events and can to be listened for events. |


<br><a name="WrappedEventTarget+listen"></a>

## wrappedEventTarget.listen()
> Attaches an event listener to the target.

**See**: [listen() function](#listen) for details about the parameters and the return value  

<br><a name="WrappedEventTarget+dispatch"></a>

## wrappedEventTarget.dispatch()
> Dispatches an event.

**See**: [dispatch() function](#dispatch) for details about the parameters and the returnvalue  

<br><a name="listen"></a>

# listen(target, types, [listener], [options]) ⇒ [<code>EventListener</code>](#EventListener)
> Sets up an EventListener

**Returns**: [<code>EventListener</code>](#EventListener) - an instance of EventListener configured with the given parameter  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>object</code>, <code>EventTarget</code> | an EventTarget (or any other JS object) to listen for the event(s). Objects that are not natively EventTarget will be mapped internally to an EventTarget in order to emulate the listening. |
| types | <code>string</code>, <code>Array.&lt;string&gt;</code> | a single event type or an array of event types or a space-separated list of event type. Example: 'click', ['mouseenter', 'mouseleave'], 'resize scroll'. |
| [listener] | <code>function</code>, <code>object</code> | a function or object that implement the handleEvent() method |
| [options] | <code>object</code>, <code>boolean</code> | contains the listening options. Accepts all the standrd options accepted by addEventListener - capture, once, passive, signal - plus three additional custom properties used to provide additional - non standard - features. |
| [options.selector] | <code>string</code> | used to implement event delegation. The listener will be called only when the event has been dispatched by elements nested in the target that match the selector. |
| [options.throttle] | <code>number</code>, <code>boolean</code> | when throttle is true, the requestAnimationFrame will be used to throttle the calls to the listeners. When it is a number, it will be used as milliseconds mimimum interval between the calls. The throttled listener is guaranteed to be called both with the first and the last event, while those in between may be ignored. The last call could be delayed in respect to the actual event moment. |
| [options.late] | <code>boolean</code> | when the late flag is true, the listener can be called (and the inner promise resolved) also if a 'late' event has been dispatched before setting up the listener. A late event is a CustomEvent dispatched by the [dispatch() function](#dispatch) setting the late option to true. |


<br><a name="dispatch"></a>

# dispatch(target, type, [options]) ⇒ <code>Event</code>
> Dispaches an event for the given target

**Returns**: <code>Event</code> - the dispatched event object  
**Emits**: <code>event:Event</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| target | <code>object</code>, <code>EventTarget</code> |  | an EventTarget (or any other JS object) that will dispatch the event. Objects that are not natively EventTarget will be mapped internally to an EventTarget in order to emulate the dispatching. |
| type | <code>string</code>, <code>Event</code> |  | a type of a custom event to be created or an already created Event object |
| [options] | <code>object</code> |  | can contain the standard options to create an event (details, bubbles, cancelable, composed), plus an additional 'late' option |
| [options.late] | <code>boolean</code> | <code>false</code> | when passed and true, the event will be kept after the dispatch in order to be notified also to "late listeners", that are event listeners created with the late flag after the event has been already dispatched |


<br><a name="eventTarget"></a>

# eventTarget(target) ⇒ [<code>WrappedEventTarget</code>](#WrappedEventTarget)
> Gives back a weakly cached WrappedEventTarget

**Returns**: [<code>WrappedEventTarget</code>](#WrappedEventTarget) - the WrappedEventTarget associated with the given target  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>object</code>, <code>EventTarget</code> | the object to be wrapped |

