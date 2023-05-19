const listen = window.nuff.listen;
const dispatch = window.nuff.dispatch;
const eventTarget = window.nuff.eventTarget;

let container;
let content;
let subContent;

const wait = (amount = 10) => {
	return new Promise((resolve) => {
		setTimeout(resolve, amount);
	});
};

describe('Events:', () => {
	beforeAll(() => {
		container = document.querySelector('.container');
		content = document.querySelector('.content');
		subContent = document.querySelector('.subContent');
	});

	it('Exported correctly', () => {
		expect(listen).toBeInstanceOf(Function);
		expect(dispatch).toBeInstanceOf(Function);
		expect(eventTarget).toBeInstanceOf(Function);
	});

	it('Built-in Events: listen and unlisten', () => {
		const events = {
			handler: () => {},
		};
		spyOnAllFunctions(events);
		const listener = listen(container, 'click', events.handler);
		container.click();
		content.click();
		listener.unlisten();
		container.click();
		content.click();
		expect(events.handler).toHaveBeenCalledTimes(2);
	});

	it('Built-in Events: listen and unlisten with object listener', () => {
		const evs = {
			handler: () => {},
		};

		spyOnAllFunctions(evs);

		const l = {
			handleEvent: function (e) {
				evs.handler();
			},
		};

		const listener = eventTarget(container).listen('click', l);
		container.click();
		content.click();
		listener.unlisten();
		container.click();
		content.click();
		expect(evs.handler).toHaveBeenCalledTimes(2);
	});

	it('Built-in Events: delegation', () => {
		const evs = {
			handler: () => {},
			delegatedHandler: () => {},
		};
		spyOnAllFunctions(evs);
		const listener = listen(container, 'click', evs.handler);
		container.click();
		subContent.click();
		expect(evs.handler).toHaveBeenCalledTimes(2);
		const delegatedListener = listen(container, 'click', evs.delegatedHandler, {selector: '.content'});
		container.click();
		subContent.click();
		listener.unlisten();
		delegatedListener.unlisten();
		expect(evs.delegatedHandler).toHaveBeenCalledTimes(1);
		expect(evs.delegatedHandler.calls.argsFor(0)[1]).toBe(content);
	});

	it('Built-in Events: delegation - second param as target', () => {
		let target1;
		let target2;
		const evs = {
			handler: (event, target) => {
				target1 = target;
			},
			delegatedHandler: (event, target) => {
				target2 = target;
			},
		};
		const listener = listen(container, 'click', evs.handler);
		subContent.click();
		expect(target1).toBe(container);
		const delegatedListener = listen(container, 'click', evs.delegatedHandler, {selector: '.content'});
		subContent.click();
		expect(target2).toBe(content);
		listener.unlisten();
		delegatedListener.unlisten();
	});

	it('Options: once #1', () => {
		const node = document.createElement('i');
		const handlers = {
			handler: () => {},
		};
		spyOnAllFunctions(handlers);
		const listener = listen(node, 'test', handlers.handler, {once: true});
		eventTarget(node).dispatch(new CustomEvent('test'));
		eventTarget(node).dispatch(new CustomEvent('test'));
		listener.unlisten();
		expect(handlers.handler).toHaveBeenCalledTimes(1);
	});

	it('Options: once #2', () => {
		const node = document.createElement('i');
		const handlers = {
			handler: () => {},
		};
		spyOnAllFunctions(handlers);
		const listener = listen(node, 'test', handlers.handler, {once: true});
		dispatch(node, 'test');
		dispatch(node, 'test');
		listener.unlisten();
		expect(handlers.handler).toHaveBeenCalledTimes(1);
	});

	it('Options: passive #1', () => {
		const node = document.createElement('i');
		let defaultPrevented;
		let executed;
		const handler = (event) => {
			event.preventDefault();
			executed = true;
			defaultPrevented = event.defaultPrevented;
		};
		listen(node, 'test', handler, {passive: true});
		dispatch(node, new CustomEvent('test', {cancelable: true}));
		expect(executed).toBe(true);
		expect(defaultPrevented).toBeFalsy();
	});

	it('Options: passive #2', () => {
		const node = document.createElement('i');
		let defaultPrevented;
		let executed;
		const handler = (event) => {
			event.preventDefault();
			executed = true;
			defaultPrevented = event.defaultPrevented;
		};
		listen(node, 'test', handler, {passive: true});
		dispatch(node, 'test', {cancelable: true});
		expect(executed).toBe(true);
		expect(defaultPrevented).toBeFalsy();
	});

	it('Options: capture #1', () => {
		const node = document.createElement('i');
		const node2 = document.createElement('i');
		node.appendChild(node2);
		const eventPhases = [];
		const orders = [];
		let pos = 0;
		listen(
			node,
			'test',
			(event) => {
				eventPhases[0] = event.eventPhase;
				orders[0] = pos++;
			},
			{capture: false}
		);
		listen(
			node,
			'test',
			(event) => {
				eventPhases[1] = event.eventPhase;
				orders[1] = pos++;
			},
			{capture: true}
		);
		dispatch(node2, new CustomEvent('test', {bubbles: true}));
		expect(eventPhases[0]).not.toBe(Event.CAPTURING_PHASE);
		expect(eventPhases[1]).toBe(Event.CAPTURING_PHASE);
		expect(orders[0]).toBe(1);
		expect(orders[1]).toBe(0);
	});

	it('Options: capture #2', () => {
		const node = document.createElement('i');
		const node2 = document.createElement('i');
		node.appendChild(node2);
		const eventPhases = [];
		const orders = [];
		let pos = 0;
		listen(node, 'test', (event) => {
			eventPhases[0] = event.eventPhase;
			orders[0] = pos++;
		});
		listen(
			node,
			'test',
			(event) => {
				eventPhases[1] = event.eventPhase;
				orders[1] = pos++;
			},
			true
		);
		dispatch(node2, 'test', {bubbles: true});
		expect(eventPhases[0]).not.toBe(Event.CAPTURING_PHASE);
		expect(eventPhases[1]).toBe(Event.CAPTURING_PHASE);
		expect(orders[0]).toBe(1);
		expect(orders[1]).toBe(0);
	});

	it('Custom event data', () => {
		const node = document.createElement('i');
		const data = {};
		listen(node, 'test', (event) => {
			Object.assign(data, event.detail);
		});
		dispatch(node, new CustomEvent('test', {detail: {a: 'aaa'}}));
		dispatch(node, 'test', {detail: {b: 'bbb'}});
		expect(data.a).toBe('aaa');
		expect(data.b).toBe('bbb');
	});

	it('Listen multiple events', () => {
		const node = document.createElement('i');
		const handlers = {
			handler: () => {},
		};
		spyOnAllFunctions(handlers);
		listen(node, ['test0', 'test1'], handlers.handler);
		listen(node, 'test2 test3  test4    test5', handlers.handler);
		dispatch(node, 'test0');
		dispatch(node, 'test1');
		dispatch(node, 'test2');
		dispatch(node, 'test3');
		dispatch(node, 'test4');
		dispatch(node, 'test5');
		expect(handlers.handler).toHaveBeenCalledTimes(6);
	});

	it('Listen multiple events - shared once', () => {
		const node = document.createElement('i');
		const handlers = {
			handler: () => {},
		};
		spyOnAllFunctions(handlers);
		listen(node, 'test0 test1', handlers.handler, {once: true});
		listen(node, 'test2 test3', handlers.handler, {once: true});
		dispatch(node, 'test0');
		dispatch(node, 'test1');
		dispatch(node, 'test3');
		dispatch(node, 'test2');
		expect(handlers.handler).toHaveBeenCalledTimes(2);
	});

	it('Throttle: requestanimationframe()', async () => {
		const node = document.createElement('i');

		let counter = 0;
		const testCallbacks = {
			handler: () => {},
		};
		spyOnAllFunctions(testCallbacks);
		const l = listen(
			node,
			'test',
			(event) => {
				counter += event.detail.i;
				testCallbacks.handler();
			},
			{throttle: true}
		);
		for (let i = 1; i <= 1000; i++) {
			dispatch(node, 'test', {detail: {i: i}});
		}
		await wait(50);
		expect(counter).toBe(1001);
		expect(testCallbacks.handler).toHaveBeenCalledTimes(2);
		l.unlisten();

		const callbacks = {
			handler: () => {},
		};
		const handlers = {
			handler: () => {
				callbacks.handler();
			},
		};
		spyOnAllFunctions(callbacks);
		listen(node, 'test', handlers.handler, {throttle: true});
		for (let i = 0; i < 1000; i++) {
			dispatch(node, 'test');
		}
		await wait(50);
		for (let i = 0; i < 1000; i++) {
			dispatch(node, 'test');
		}
		await wait(50);
		expect(callbacks.handler).toHaveBeenCalledTimes(4);
	});

	it('Throttle: interval', async () => {
		const node = document.createElement('i');
		const handlers = {
			handler: () => {},
		};
		spyOnAllFunctions(handlers);
		listen(node, 'test', handlers.handler, {throttle: 10});
		for (let i = 0; i < 1000; i++) {
			dispatch(node, 'test');
		}
		await wait(50);
		for (let i = 0; i < 1000; i++) {
			dispatch(node, 'test');
		}
		await wait(50);
		for (let i = 0; i < 1000; i++) {
			dispatch(node, 'test');
		}
		await wait(50);
		expect(handlers.handler).toHaveBeenCalledTimes(6);
	});

	it('Override context', () => {
		const node = document.createElement('i');
		const customTarget = {
			counter: 0,
		};
		const handler = function (event) {
			this.counter++;
		};
		listen(node, 'test', handler.bind(customTarget));
		dispatch(node, 'test');
		dispatch(node, 'test');
		dispatch(node, 'test');
		expect(customTarget.counter).toBe(3);
	});

	it('Arbitrary target #1', () => {
		const customTarget = {
			counter: 0,
		};
		const handler = (event, target) => {
			target.counter++;
		};
		listen(customTarget, 'test', handler);
		dispatch(customTarget, 'test');
		dispatch(customTarget, 'test');
		dispatch(customTarget, 'test');
		expect(customTarget.counter).toBe(3);
	});

	it('Arbitrary target #2', () => {
		const customTarget = {
			counter: 0,
		};
		const handler = function (event, target) {
			this.counter++;
		};
		listen(customTarget, 'test', handler.bind(customTarget));
		dispatch(customTarget, 'test');
		dispatch(customTarget, 'test');
		dispatch(customTarget, 'test');
		expect(customTarget.counter).toBe(3);
	});

	it('Late Listeners #1', async () => {
		const node = document.createElement('i');
		let counter = 0;
		let value = 0;
		const handlers = {
			handler: (event) => {
				counter++;
				value = event.detail.value;
			},
		};
		dispatch(node, 'test', {late: true, detail: {value: 1}});
		dispatch(node, 'test', {late: true, detail: {value: 2}});
		dispatch(node, 'test', {late: true, detail: {value: 3}});

		let resolved = 0;
		const listener = listen(node, 'test', handlers.handler, {late: true});
		expect(value).toBe(3);
		dispatch(node, 'test', {late: true, detail: {value: 4}});
		dispatch(node, 'test', {detail: {value: 5}});

		listener.then(() => {
			resolved++;
		});
		expect(counter).toBe(3);
		await expectAsync(listener).toBeResolved();
		expect(resolved).toBe(1);
	});

	it('Late Listeners #2', async () => {
		const node = document.createElement('i');
		let counter = 0;
		let value = 0;
		const handlers = {
			handler: (event) => {
				counter++;
				value = event.detail.value;
			},
		};

		dispatch(node, new CustomEvent('test', {detail: {value: 1}}), {late: true});
		dispatch(node, new CustomEvent('test', {detail: {value: 2}}), {late: true});
		dispatch(node, new CustomEvent('test', {detail: {value: 3}}), {late: true});

		let resolved = 0;
		let listener;
		await new Promise((resolve) =>
			setTimeout(() => {
				listener = listen(node, 'test', handlers.handler, {late: true});
				dispatch(node, new CustomEvent('test', {detail: {value: 4}}), {late: true});
				dispatch(node, new CustomEvent('test', {detail: {value: 5}}));
				listener.then(() => {
					resolved++;
				});
				resolve();
			}, 10)
		);

		expect(counter).toBe(3);
		expect(value).toBe(5);
		await expectAsync(listener).toBeResolved();
		expect(resolved).toBe(1);
	});

	it('Late Listeners #3 - no listener', async () => {
		const node = document.createElement('i');
		dispatch(node, 'test', {late: true, detail: {value: 1}});
		dispatch(node, 'test', {late: true, detail: {value: 2}});
		dispatch(node, 'test', {late: true, detail: {value: 3}});

		let value = 0;
		const listener = listen(node, 'test', {late: true});
		dispatch(node, 'test', {late: true, detail: {value: 4}});
		dispatch(node, 'test', {detail: {value: 5}});
		const e = await listener;
		value = e.detail.value;

		expect(value).toBe(3);
		await expectAsync(listener).toBeResolved();
	});

	it('Late Listeners #4 - delegation', async () => {
		const handlers = {
			handler: () => {},
			handler3: () => {},
		};
		spyOnAllFunctions(handlers);

		dispatch(content, 'test1', {late: true});
		dispatch(subContent, 'test2', {late: true});
		let eventType1;
		let eventType2;
		const listener1 = listen(container, 'test1 test2', handlers.handler, {late: true, selector: '.content'}).then((event) => {
			eventType1 = event.type;
		});
		const listener2 = listen(container, 'test1 test2', handlers.handler, {late: true}).then((event) => {
			eventType2 = event.type;
		});

		listen(container, 'test3', handlers.handler3, {late: true});

		expect(handlers.handler).toHaveBeenCalledTimes(2);
		expect(handlers.handler3).toHaveBeenCalledTimes(0);
		await expectAsync(listener1).toBeResolved();
		await expectAsync(listener2).toBeResolved();
		expect(eventType1).toBe('test1');
		expect(eventType2).toBe('test2');
	});

	it('Late Listeners #5 - arbitrary target', async () => {
		const customTarget = {
			counter: 0,
		};
		const handlers = {
			handler: (event, target) => {
				target.counter++;
			},
		};

		dispatch(customTarget, 'test', {late: true});
		const listener = listen(customTarget, 'test', handlers.handler, {late: true});
		dispatch(customTarget, 'test', {late: true});

		await expectAsync(listener).toBeResolved();
		expect(customTarget.counter).toBe(2);
	});

	it('Late Listeners #6 - promise only', async () => {
		const node = document.createElement('i');
		dispatch(node, 'test', {late: true, detail: {value: 1}});
		const listener = listen(node, 'test', {late: true, once: true});
		await expectAsync(listener).toBeResolved();
	});
});
