# NUFF
> *short for "enough", but often "enough" is used to mean "lots of"* — Urban Dictionary

There are a lot of very powerful JS frameworks capable of doing very cool things, but a lot of
simple content-oriented websites do not need that much power, sometimes to use less JavaScript is
*enough*.

**NUFF** is a small collection of tiny independent libraries that aim to solve simple issues.    
The whole NUFF is just 4.43 KB but each library can be used separately.

Each library included in NUFF respects this contract:
- runs in modern browsers;
- has no external dependencies;
- is written in standard ES JavaScript, no transpiling involved;
- exports also the classes used internally, not only the instances, so you could extend and
  modify them at runtime without the need to always fork the repository;
- is fully documented;
- is unit tested with 100% coverage.

Here are the libraries currently included in NUFF:

## lazyCustomElements

The LazyCustomElementRegistry class is a Custom Element registry for defining and upgrading custom
elements in a lazy manner, plus some interesting additional features.

2.09 KB | [Tutorial](docs/lazy-custom-elements-tutorial.md) | [API Docs](docs/lazy-custom-elements.md)

## events

Standard DOM Event listening and dispatching, but on steroids.  
It supports delegation, throttling, listen to / dispatch events from any JS object (not only DOM
elements), *late listening* to custom events being dispatched in the past.

1.14 KB | [Tutorial](docs/events-tutorial.md) | [API Docs](docs/events.md)

## dataset

Small utility to deal with data-attributes taking a namespace or prefix into account.
It also takes care of type casting the values.

1.07 KB | [Tutorial](docs/dataset-tutorial.md) | [API Docs](docs/dataset.md)

## classList

Like the standard element.classList but taking a namespace or prefix into account.

645 B | [Tutorial](docs/classlist-tutorial.md) | [API Docs](docs/classlist.md)

## cssVars

Small utility to read / write CSS variables (custom properties) taking care of type casting.

740 B | [Tutorial](docs/css-vars-tutorial.md) | [API Docs](docs/css-vars.md)

