/* global viewport, nuff */

const LazyCustomElementRegistry = nuff.LazyCustomElementRegistry;
const lce = nuff.lazyCustomElements;
const ce = window.customElements;

const wait = (amount = 10) => {
	return new Promise((resolve) => {
		setTimeout(resolve, amount);
	});
};

/**
 *
 * @param {(string|[]array)} name
 * @param {number} type
 */
function f(name, type) {}

const callbacks = {};

class NotHtmlElement {}

class C1 extends HTMLElement {}
class C2 extends HTMLElement {}
class C3 extends HTMLElement {}

for (let i = 4; i <= 7; i++) {
	const type = 'C' + i;
	const prefix = 'c' + i;

	callbacks[prefix + 'Connected'] = () => {};
	callbacks[prefix + 'Disconnected'] = () => {};

	window[type] = class extends HTMLElement {
		connectedCallback() {
			callbacks[prefix + 'Connected']();
		}

		disconnectedCallback() {
			callbacks[prefix + 'Disconnected']();
		}
	};
}

let c8order = 10;
callbacks.c8Connected = () => {};
callbacks.c8Disconnected = () => {};
callbacks.c8Load = () => {};
callbacks.c9Load = () => {};
callbacks.c10Connected = () => {};
callbacks.c10Disconnected = () => {};
callbacks.c10Load = () => {};
callbacks.c11Connected = () => {};
callbacks.c11Disconnected = () => {};

class C8 extends HTMLElement {
	connectedCallback() {
		c8order -= 4;
		callbacks.c8Connected();
	}

	disconnectedCallback() {
		callbacks.c8Disconnected();
	}

	load() {
		c8order *= 2;
		callbacks.c8Load();
	}
}

class C9 extends C8 {
	customLoad() {
		callbacks.c9Load();
	}
}

class C10 extends HTMLElement {
	connectedCallback() {
		callbacks.c10Connected();
	}

	disconnectedCallback() {
		callbacks.c10Disconnected();
	}

	load() {
		callbacks.c10Load();
	}
}

class C11 extends HTMLElement {
	connectedCallback() {
		callbacks.c11Connected();
	}

	disconnectedCallback() {
		callbacks.c11Disconnected();
	}
}

class C12 extends C11 {}

let b4order = 10;
callbacks.b1Connected = () => {};
callbacks.b1Disconnected = () => {};
callbacks.b2Connected = () => {};
callbacks.b2Disconnected = () => {};
callbacks.b3Connected = () => {};
callbacks.b3Disconnected = () => {};
callbacks.b4FirstConnected = () => {};
callbacks.b4Connected = () => {};
callbacks.b4Disconnected = () => {};
callbacks.b5FirstConnected = () => {};
callbacks.b5Disconnected = () => {};
callbacks.b6FirstConnected = () => {};
callbacks.b6Connected = () => {};
callbacks.b6Disconnected = () => {};

class B1 extends HTMLParagraphElement {
	connectedCallback() {
		callbacks.b1Connected();
	}

	disconnectedCallback() {
		callbacks.b1Disconnected();
	}
}

const B2 = (Base) =>
	class extends Base {
		connectedCallback() {
			callbacks.b2Connected();
		}

		disconnectedCallback() {
			callbacks.b2Disconnected();
		}
	};

const B3 = (Base) =>
	class extends Base {
		connectedCallback() {
			callbacks.b3Connected();
		}

		disconnectedCallback() {
			callbacks.b3Disconnected();
		}
	};

class B4 extends HTMLParagraphElement {
	firstConnectedCallback() {
		b4order -= 4;
		callbacks.b4FirstConnected();
	}

	connectedCallback() {
		b4order *= 2;
		callbacks.b4Connected();
	}

	disconnectedCallback() {
		callbacks.b4Disconnected();
	}
}

class B5 extends HTMLParagraphElement {
	customFirstConnectedCallback() {
		callbacks.b5FirstConnected();
	}

	disconnectedCallback() {
		callbacks.b5Disconnected();
	}
}

class B6 extends HTMLElement {
	firstConnectedCallback() {
		callbacks.b6FirstConnected();
	}

	connectedCallback() {
		callbacks.b6Connected();
	}

	disconnectedCallback() {
		callbacks.b6Disconnected();
	}
}

class NotHtml {}

const defineIntersection = new WeakSet();
const loadIntersection = new WeakSet();
let defineObserver = null;
let loadObserver = null;
const options = lce.getOptions();

describe('Lazy Custom Elements:', () => {
	beforeAll(() => {
		viewport.set(100, 100);
		document.body.style.height = '5000px';
		window.scrollTo(0, 0);
		defineObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						defineIntersection.add(entry.target);
					}
				}
			},
			{
				root: document,
				rootMargin: options.autodefineRootMargin,
				threshold: options.autodefineThreshold,
			}
		);

		loadObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						loadIntersection.add(entry.target);
					}
				}
			},
			{
				root: document,
				rootMargin: options.autoloadRootMargin,
				threshold: options.autoloadThreshold,
			}
		);

		spyOnAllFunctions(callbacks);
	});
	it('should be exported correctly', () => {
		expect(lce).toBeInstanceOf(LazyCustomElementRegistry);
		expect(lce.getDefaultOptions()).toEqual(lce.getOptions());
		const autodefineRoot = options.autodefineRoot;
		lce.setOptions({autodefineRoot: document.body});
		expect(lce.getOptions().autodefineRoot).toBe(document.body);
		lce.setOptions({autodefineRoot: autodefineRoot});
	});

	it('should define synchrounously', async () => {
		let p1Resolved = false;
		const p1 = lce.whenDefined('nuff-c1').then(() => {
			p1Resolved = true;
		});
		expect(p1Resolved).toBeFalse();
		lce.define('nuff-c1', C1);
		expect(ce.get('nuff-c1')).toBe(C1);
		expect(await lce.get('nuff-c1')).toBe(C1);
		await expectAsync(p1).toBeResolved();
		expect(p1Resolved).toBeTrue();
	});

	it('should define asynchrounously', async () => {
		let p1Resolved = false;
		const p1 = lce.whenDefined('nuff-c2').then(() => {
			p1Resolved = true;
		});
		const node2 = document.createElement('nuff-c2');
		expect(node2 instanceof C2).toBeFalse();
		lce.define('nuff-c2', async () => wait().then(() => C2));
		expect(node2 instanceof C2).toBeFalse();
		await lce.upgradeElement(node2);
		expect(node2 instanceof C2).toBeTrue();

		const node3 = document.createElement('nuff-c3');
		expect(node3 instanceof C3).toBeFalse();
		lce.define('nuff-c3', async () => wait().then(() => C3));
		expect(node3 instanceof C3).toBeFalse();
		const construct3 = await lce.get('nuff-c3');
		ce.define('nuff-c3', C3);
		expect(node3 instanceof C3).toBeFalse();
		await lce.upgradeElement(node3);
		expect(node3 instanceof C3).toBeTrue();

		class SubC3 extends C3 {}
		lce.define('nuff-sub-c3', SubC3);
		const subC3 = await lce.get('nuff-sub-c3');
		expect(subC3).toBe(SubC3);

		class CustomP extends HTMLParagraphElement {}
		lce.define('nuff-p', CustomP, {extends: 'p'});
		expect(await lce.get('nuff-p')).toBe(CustomP);
	});

	it('should intercept elements registered before', async () => {
		window.scrollTo(0, 0);
		lce.define('nuff-c4', async () => wait().then(() => C4), {
			autodefineRootMargin: '0px 0px 100% 0px',
		});
		const node = document.createElement('nuff-c4');
		node.style.position = 'absolute';
		node.style.top = '300px';
		document.body.appendChild(node);
		defineObserver.observe(node);
		await wait(100);
		expect(defineIntersection.has(node)).toBeFalse();
		expect(node instanceof C4).toBeFalse();
		expect(callbacks.c4Connected).not.toHaveBeenCalled();
		window.scrollTo(0, 110);
		await wait(50);
		expect(defineIntersection.has(node)).toBeTrue();
		expect(node instanceof C4).toBeTrue();
		expect(callbacks.c4Connected).toHaveBeenCalledTimes(1);
		document.body.removeChild(node);
		await wait(50);
		expect(callbacks.c4Disconnected).toHaveBeenCalledTimes(1);
		window.scrollTo(0, 0);
	});

	it('should intercept elements registered after', async () => {
		window.scrollTo(0, 0);
		const node = document.createElement('nuff-c5');
		node.style.position = 'absolute';
		node.style.top = '350px';
		expect(node instanceof C5).toBeFalse();
		expect(callbacks.c5Connected).not.toHaveBeenCalled();
		window.scrollTo(0, 110);
		await wait(50);
		expect(node instanceof C5).toBeFalse();
		expect(callbacks.c5Connected).not.toHaveBeenCalled();
		document.body.appendChild(node);
		defineObserver.observe(node);
		lce.define('nuff-c5', async () => wait().then(() => C5), {autodefineRoot: document});
		window.scrollTo(0, 160);
		await wait(50);
		expect(defineIntersection.has(node)).toBeTrue();
		expect(node instanceof C5).toBeTrue();
		expect(callbacks.c5Connected).toHaveBeenCalledTimes(1);
		document.body.removeChild(node);
		await wait(50);
		expect(callbacks.c5Disconnected).toHaveBeenCalledTimes(1);
		window.scrollTo(0, 0);
	});

	it('should not intercept elements with autodefine disabled', async () => {
		window.scrollTo(0, 0);
		lce.define('nuff-c6', async () => wait().then(() => C6));
		const node = document.createElement('nuff-c6');
		node.style.position = 'absolute';
		node.style.top = '10px';
		node.setAttribute(options.autodefineAttribute, 'false');
		document.body.appendChild(node);
		defineObserver.observe(node);
		expect(node instanceof C6).toBeFalse();
		expect(callbacks.c6Connected).not.toHaveBeenCalled();
		await wait(50);
		expect(defineIntersection.has(node)).toBeTrue();
		expect(node instanceof C6).toBeFalse();
		expect(callbacks.c6Connected).not.toHaveBeenCalled();
		await lce.upgrade(node);
		expect(node instanceof C6).toBeTrue();
		expect(callbacks.c6Connected).toHaveBeenCalledTimes(1);
		document.body.removeChild(node);
		await wait(50);
		expect(callbacks.c6Disconnected).toHaveBeenCalledTimes(1);
	});

	it('should intercept elements with autodefine true', async () => {
		window.scrollTo(0, 0);
		const node = document.createElement('nuff-c7');
		node.style.position = 'absolute';
		node.style.top = '4000px';
		node.setAttribute(options.autodefineAttribute, 'true');
		node.classList.add('testClass');
		const node2 = document.createElement('nuff-c7');
		node2.style.position = 'absolute';
		node2.style.top = '4000px';
		node2.setAttribute(options.autodefineAttribute, 'true');
		node2.classList.add('testClass');
		document.body.appendChild(node);
		defineObserver.observe(node);
		await wait(50);
		expect(defineIntersection.has(node)).toBeFalse();
		expect(node instanceof C7).toBeFalse();
		expect(node2 instanceof C7).toBeFalse();
		expect(callbacks.c7Connected).not.toHaveBeenCalled();
		lce.define('nuff-c7', async () => wait().then(() => C7), {selector: '.testClass'});
		await wait(50);
		expect(node instanceof C7).toBeTrue();
		expect(callbacks.c7Connected).toHaveBeenCalledTimes(1);
		document.body.appendChild(node2);
		defineObserver.observe(node2);
		await wait(50);
		expect(defineIntersection.has(node2)).toBeFalse();
		expect(node2 instanceof C7).toBeTrue();
		expect(callbacks.c7Connected).toHaveBeenCalledTimes(2);
		document.body.removeChild(node);
		document.body.removeChild(node2);
		await wait(50);
		expect(callbacks.c7Disconnected).toHaveBeenCalledTimes(2);
	});

	it('should intercept elements with autoload true', async () => {
		window.scrollTo(0, 0);
		const node = document.createElement('nuff-c8');
		node.style.position = 'absolute';
		node.style.top = '4000px';
		node.setAttribute(options.autodefineAttribute, 'true');
		node.setAttribute(options.autoloadAttribute, 'true');
		const node2 = document.createElement('nuff-c9');
		node2.style.position = 'absolute';
		node2.style.top = '4000px';
		node2.setAttribute(options.autodefineAttribute, 'true');
		node2.setAttribute(options.autoloadAttribute, 'true');
		document.body.appendChild(node);
		loadObserver.observe(node);
		await wait(50);
		expect(loadIntersection.has(node)).toBeFalse();
		expect(node instanceof C8).toBeFalse();
		expect(callbacks.c8Connected).not.toHaveBeenCalled();
		expect(callbacks.c8Load).not.toHaveBeenCalled();
		lce.define('nuff-c8', async () => wait().then(() => C8));
		lce.define('nuff-c9', async () => wait().then(() => C9), {loadMethod: 'customLoad'});
		await wait(50);
		expect(node instanceof C8).toBeTrue();
		expect(callbacks.c8Connected).toHaveBeenCalledTimes(1);
		expect(callbacks.c8Load).toHaveBeenCalledTimes(1);
		expect(c8order).toBe(12);
		document.body.appendChild(node2);
		loadObserver.observe(node2);
		await wait(50);
		expect(loadIntersection.has(node2)).toBeFalse();
		expect(node2 instanceof C9).toBeTrue();
		expect(callbacks.c8Connected).toHaveBeenCalledTimes(2);
		expect(callbacks.c8Load).toHaveBeenCalledTimes(1);
		expect(callbacks.c9Load).toHaveBeenCalledTimes(1);
		document.body.removeChild(node);
		document.body.removeChild(node2);
		await wait(50);
		expect(callbacks.c8Disconnected).toHaveBeenCalledTimes(2);
	});

	it('should intercept elements with autoload lazy', async () => {
		window.scrollTo(0, 0);
		lce.define('nuff-c10', async () => wait().then(() => C10));
		const node = document.createElement('nuff-c10');
		node.style.position = 'absolute';
		node.style.top = '400px';
		node.setAttribute(options.autoloadAttribute, options.lazyValue);
		defineObserver.observe(node);
		loadObserver.observe(node);
		await wait(10);
		document.body.appendChild(node);
		expect(node instanceof C10).toBeFalse();
		window.scrollTo(0, 200);
		await wait(50);
		expect(defineIntersection.has(node)).toBeTrue();
		expect(loadIntersection.has(node)).toBeFalse();
		expect(callbacks.c10Connected).toHaveBeenCalledTimes(1);
		expect(callbacks.c10Load).not.toHaveBeenCalled();
		window.scrollTo(0, 250);
		await wait(50);
		expect(loadIntersection.has(node)).toBeTrue();
		expect(callbacks.c10Load).toHaveBeenCalledTimes(1);
		document.body.removeChild(node);
		await wait(50);
		expect(callbacks.c10Disconnected).toHaveBeenCalledTimes(1);
	});

	it('should define custom builtin elements', async () => {
		window.scrollTo(0, 0);
		lce.define('nuff-b1', async () => wait().then(() => B1), {extends: 'p'});
		const node = lce.createElement('p', {is: 'nuff-b1'});
		node.style.position = 'absolute';
		node.style.top = '300px';
		document.body.appendChild(node);
		defineObserver.observe(node);
		await wait(100);
		expect(defineIntersection.has(node)).toBeFalse();
		expect(node instanceof HTMLParagraphElement).toBeTrue();
		expect(node instanceof B1).toBeFalse();
		expect(callbacks.b1Connected).not.toHaveBeenCalled();
		window.scrollTo(0, 120);
		await wait(50);
		expect(defineIntersection.has(node)).toBeTrue();
		expect(node instanceof B1).toBeTrue();
		expect(node instanceof HTMLParagraphElement).toBeTrue();
		expect(callbacks.b1Connected).toHaveBeenCalledTimes(1);
		document.body.removeChild(node);
		await wait(50);
		expect(callbacks.b1Disconnected).toHaveBeenCalledTimes(1);
		window.scrollTo(0, 0);
	});

	it('should define custom builtin elements with multiple parents', async () => {
		window.scrollTo(0, 0);
		lce.define('nuff-b2-', async () => wait().then(() => B2), {extends: ['a', 'button']});
		const node = lce.createElement('a', {is: 'nuff-b2-a'});
		node.style.position = 'absolute';
		node.style.top = '300px';
		document.body.appendChild(node);
		const node2 = lce.createElement('button', {is: 'nuff-b2-button'});
		node2.style.position = 'absolute';
		node2.style.top = '300px';
		document.body.appendChild(node2);
		defineObserver.observe(node);
		defineObserver.observe(node2);
		await wait(100);
		expect(defineIntersection.has(node)).toBeFalse();
		expect(defineIntersection.has(node2)).toBeFalse();
		expect(node instanceof HTMLAnchorElement).toBeTrue();
		expect(node2 instanceof HTMLButtonElement).toBeTrue();
		expect(callbacks.b2Connected).not.toHaveBeenCalled();
		window.scrollTo(0, 120);
		await wait(50);
		expect(defineIntersection.has(node)).toBeTrue();
		expect(defineIntersection.has(node2)).toBeTrue();
		expect(node instanceof HTMLAnchorElement).toBeTrue();
		expect(node2 instanceof HTMLButtonElement).toBeTrue();
		expect(callbacks.b2Connected).toHaveBeenCalledTimes(2);
		document.body.removeChild(node);
		document.body.removeChild(node2);
		await wait(50);
		expect(callbacks.b2Disconnected).toHaveBeenCalledTimes(2);
		window.scrollTo(0, 0);
	});

	it('should define custom builtin elements with any parents', async () => {
		window.scrollTo(0, 0);
		lce.define('nuff-b3-', async () => wait().then(() => B3), {extends: '*'});
		const node = lce.createElement('a', {is: 'nuff-b3-a'});
		node.style.position = 'absolute';
		node.style.top = '300px';
		document.body.appendChild(node);
		const node2 = lce.createElement('button', {is: 'nuff-b3-button'});
		node2.style.position = 'absolute';
		node2.style.top = '300px';
		document.body.appendChild(node2);
		defineObserver.observe(node);
		defineObserver.observe(node2);
		await wait(100);
		expect(defineIntersection.has(node)).toBeFalse();
		expect(defineIntersection.has(node2)).toBeFalse();
		expect(node instanceof HTMLAnchorElement).toBeTrue();
		expect(node2 instanceof HTMLButtonElement).toBeTrue();
		expect(callbacks.b3Connected).not.toHaveBeenCalled();
		window.scrollTo(0, 120);
		await wait(50);
		expect(defineIntersection.has(node)).toBeTrue();
		expect(defineIntersection.has(node2)).toBeTrue();
		expect(node instanceof HTMLAnchorElement).toBeTrue();
		expect(node2 instanceof HTMLButtonElement).toBeTrue();
		expect(callbacks.b3Connected).toHaveBeenCalledTimes(2);
		document.body.removeChild(node);
		document.body.removeChild(node2);
		await wait(50);
		expect(callbacks.b3Disconnected).toHaveBeenCalledTimes(2);
		window.scrollTo(0, 0);
	});

	it('should provide firstConnectedCallback feature', async () => {
		window.scrollTo(0, 0);
		lce.define('nuff-b4', async () => wait().then(() => B4), {extends: 'p'});
		lce.define('nuff-b5', async () => wait().then(() => B5), {
			extends: 'p',
			firstConnectedCallbackMethod: 'customFirstConnectedCallback',
		});
		const node = lce.createElement('p', {is: 'nuff-b4'});
		node.style.position = 'absolute';
		node.style.top = '300px';
		document.body.appendChild(node);
		const node2 = lce.createElement('p', {is: 'nuff-b5'});
		node2.style.position = 'absolute';
		node2.style.top = '300px';
		document.body.appendChild(node2);
		defineObserver.observe(node);
		defineObserver.observe(node2);
		await wait(100);
		expect(defineIntersection.has(node)).toBeFalse();
		expect(defineIntersection.has(node2)).toBeFalse();
		expect(node instanceof HTMLParagraphElement).toBeTrue();
		expect(node2 instanceof HTMLParagraphElement).toBeTrue();
		expect(node instanceof B4).toBeFalse();
		expect(node2 instanceof B5).toBeFalse();
		expect(callbacks.b4Connected).not.toHaveBeenCalled();
		expect(callbacks.b4FirstConnected).not.toHaveBeenCalled();
		expect(callbacks.b5FirstConnected).not.toHaveBeenCalled();
		window.scrollTo(0, 120);
		await wait(50);
		expect(defineIntersection.has(node)).toBeTrue();
		expect(defineIntersection.has(node2)).toBeTrue();
		expect(node instanceof HTMLParagraphElement).toBeTrue();
		expect(node2 instanceof HTMLParagraphElement).toBeTrue();
		expect(node instanceof B4).toBeTrue();
		expect(node2 instanceof B5).toBeTrue();
		expect(callbacks.b4Connected).not.toHaveBeenCalled();
		expect(callbacks.b4FirstConnected).toHaveBeenCalledTimes(1);
		expect(callbacks.b5FirstConnected).toHaveBeenCalledTimes(1);
		expect(b4order).toBe(6);
		document.body.removeChild(node);
		document.body.removeChild(node2);
		await wait(50);
		expect(callbacks.b4Disconnected).toHaveBeenCalledTimes(1);
		expect(callbacks.b5Disconnected).toHaveBeenCalledTimes(1);
		document.body.appendChild(node);
		document.body.appendChild(node2);
		await wait(50);
		expect(callbacks.b4Connected).toHaveBeenCalledTimes(1);
		expect(callbacks.b4FirstConnected).toHaveBeenCalledTimes(1);
		expect(callbacks.b5FirstConnected).toHaveBeenCalledTimes(1);
		expect(b4order).toBe(12);
		document.body.removeChild(node);
		document.body.removeChild(node2);
		await wait(50);
		expect(callbacks.b4Disconnected).toHaveBeenCalledTimes(2);
		expect(callbacks.b5Disconnected).toHaveBeenCalledTimes(2);

		lce.define('nuff-b6', B6);
		const node6 = document.createElement('nuff-b6');
		expect(node6).toBeInstanceOf(B6);
		document.body.appendChild(node6);
		await wait(50);
		expect(callbacks.b6FirstConnected).toHaveBeenCalledTimes(1);
		expect(callbacks.b6Connected).toHaveBeenCalledTimes(0);
		document.body.removeChild(node6);
		await wait(50);
		expect(callbacks.b6Disconnected).toHaveBeenCalledTimes(1);

		window.scrollTo(0, 0);
	});

	it('should query elements correctly', async () => {
		window.scrollTo(0, 0);
		const div = document.createElement('div');
		let nothing = await lce.querySelector(div, '.whatever');
		expect(nothing).toBeFalsy();
		nothing = await lce.querySelectorAll(div, '.whatever');
		expect(nothing.length).toBe(0);
		const notAnElement = {};
		await lce.upgradeElement(notAnElement);
		nothing = await lce.querySelector(notAnElement, '.whatever');
		expect(nothing).toBeNull();
		nothing = await lce.querySelectorAll(notAnElement, '.whatever');
		expect(nothing).toBeNull();
		lce.define('nuff-c11', async () => wait().then(() => C11));
		lce.define('nuff-c12', async () => wait().then(() => C12));
		const node = document.createElement('nuff-c11');
		node.style.position = 'absolute';
		node.style.top = '10px';
		node.setAttribute(options.autodefineAttribute, 'false');
		document.body.appendChild(node);
		const node2 = document.createElement('nuff-c12');
		node2.style.position = 'absolute';
		node2.style.top = '10px';
		node2.setAttribute(options.autodefineAttribute, 'false');
		node.appendChild(node2);
		await wait(50);
		expect(node instanceof C11).toBeFalse();
		expect(node2 instanceof C12).toBeFalse();
		expect(callbacks.c11Connected).not.toHaveBeenCalled();
		const firstNode = await lce.querySelector(document.body, 'nuff-c11');
		expect(callbacks.c11Connected).toHaveBeenCalledTimes(1);
		const nodes = await lce.querySelectorAll(node, 'nuff-c12');
		expect(callbacks.c11Connected).toHaveBeenCalledTimes(2);
		expect(node instanceof C11).toBeTrue();
		expect(node2 instanceof C12).toBeTrue();
		expect(firstNode).toBe(node);
		expect(nodes[0]).toBe(node2);
		document.body.removeChild(node);
		await wait(50);
		expect(callbacks.c11Disconnected).toHaveBeenCalledTimes(2);
	});

	it('should create custom built-in element that are queryable', async () => {
		window.scrollTo(0, 0);
		const MyParagraph = class extends HTMLParagraphElement {};
		customElements.define('my-paragraph', MyParagraph, {extends: 'p'});
		const element = document.createElement('p', {is: 'my-paragraph'});
		document.body.appendChild(element);
		const queryableElement = lce.createElement('p', {is: 'my-paragraph'});
		document.body.appendChild(queryableElement);
		expect(queryableElement.matches('[is="my-paragraph"]')).toBeTrue();
		expect(document.body.querySelector('[is="my-paragraph"]')).toBeInstanceOf(MyParagraph);
		document.body.removeChild(element);
		document.body.removeChild(queryableElement);
	});

	it('should handle errors', async () => {
		let counter = 0;
		try {
			lce.define('nuff-wrong-name-', async () => wait().then(() => C11));
			counter = 1;
		} catch (e) {
			expect(e instanceof Error).toBeTrue();
			expect(counter).toBe(0);
		}
		expect(lce.define).toThrowError();
		try {
			lce.define('nuff-no-html', {});
			counter = 2;
		} catch (e) {
			expect(e instanceof Error).toBeTrue();
			expect(counter).toBe(0);
		}
		expect(lce.define).toThrowError();

		await lce.upgradeElement(document.body);
		const undef = await lce.get('nuff-undefined');
		expect(undef).toBeUndefined();
		// expect(lce.upgradeElement).not.toThrowError();
	});
});
