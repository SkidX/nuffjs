const Dataset = window.nuff.Dataset;
const dataset = window.nuff.dataset;

describe('Dataset:', () => {
	it('Exported correctly', () => {
		expect(dataset).toBeInstanceOf(Function);
	});

	it('Namespace definition', () => {
		expect(dataset.getNs()).toBe('');
		dataset.setNs('xxx-');
		expect(dataset.getNs()).toBe('xxx');
		dataset.setNs('');
	});

	it('Interface', () => {
		const node = document.createElement('i');
		const ds = dataset(node);
		expect(ds.has).toBeInstanceOf(Function);
		expect(ds.get).toBeInstanceOf(Function);
		expect(ds.getString).toBeInstanceOf(Function);
		expect(ds.set).toBeInstanceOf(Function);
		expect(ds.remove).toBeInstanceOf(Function);
	});

	it('Has', () => {
		const node = document.createElement('i');
		dataset.setNs('xxx-');
		node.setAttribute('data-test-value', 'test');
		expect(dataset(node).has('testValue')).toBeFalse();
		node.setAttribute('data-xxx-test-value', 'test');
		node.setAttribute('data-yyy-test-value', 'test');
		expect(dataset(node).has('testValue')).toBeTrue();
		expect(dataset(node, 'yyy').has('testValue')).toBeTrue();
		expect(dataset(node, 'yyy-').has('testValue')).toBeTrue();
		expect(dataset(node, '').has('testValue')).toBeTrue();
		expect(new Dataset(node).has('testValue')).toBeTrue();
		expect(new Dataset(node, 'yyy').has('testValue')).toBeTrue();
		dataset.setNs('');
	});

	it('getString', () => {
		const node = document.createElement('i');
		dataset.setNs('xxx-');
		node.setAttribute('data-test-value', '1');
		expect(dataset(node).getString('testValue')).toBeNull();
		expect(dataset(node).getString('testValue', 'alt')).toBe('alt');
		expect(Object.keys(dataset(node).getString()).length).toBe(0);

		node.setAttribute('data-xxx-test-value', '[0, 1, 2]');
		node.setAttribute('data-xxx-test-another-value', 'another');
		node.setAttribute('data-yyy-test-value', '{"test": "test"}');

		expect(dataset(node).getString('testValue')).toBe('[0, 1, 2]');
		expect(dataset(node).getString('testValue', 'alt')).toBe('[0, 1, 2]');
		expect(Object.keys(dataset(node).getString()).length).toBe(2);

		expect(dataset(node, 'yyy').getString('testValue')).toBe('{"test": "test"}');
		expect(dataset(node, 'yyy').getString('testValue', 'alt')).toBe('{"test": "test"}');
		const others = {testValue: 'test'};
		const mixed = dataset(node).getString(others);
		expect(mixed.testValue).toBe('[0, 1, 2]');
		expect(mixed.testAnotherValue).toBe('another');

		dataset.setNs('');
	});

	it('get', () => {
		const node = document.createElement('i');
		dataset.setNs('xxx-');
		expect(dataset(node).get('wrongValue')).toBeNull();
		node.setAttribute('data-test-value', '1');
		expect(dataset(node).get('testValue')).toBeNull();
		expect(dataset(node).get('testValue', 'alt')).toBe('alt');
		expect(Object.keys(dataset(node).get()).length).toBe(0);
		expect(Object.keys(dataset(node, '').get()).length).toBe(1);

		node.setAttribute('data-xxx-test-value', '[0, 1, "2"]');
		node.setAttribute('data-xxx-null-value', 'null');
		node.setAttribute('data-xxx-test-another-value', 2.5);
		node.setAttribute('data-xxx-bool-value', true);
		node.setAttribute('data-xxx-another-bool-value', false);
		node.setAttribute('data-yyy-test-value', '{"test": "aaa"}');
		node.setAttribute('data-xxx-string-value', 'test');
		node.setAttribute('data-xxx-bad-value', '{test}');
		expect(dataset(node).get('nullValue')).toBeNull();
		expect(dataset(node).get('stringValue')).toBe('test');
		expect(dataset(node).get('badValue')).toBe('{test}');
		expect(dataset(node).get('boolValue')).toBe(true);
		expect(dataset(node).get('anotherBoolValue', true)).toBe(false);
		const others = {nullValue: 10};
		const mixed = dataset(node).get(others);
		expect(mixed.nullValue).toBeNull();
		expect(mixed.stringValue).toBe('test');
		dataset.setNs('');
	});

	it('set', () => {
		const node = document.createElement('i');
		dataset.setNs('xxx-');
		dataset(node).set('testValue', -4.5);
		dataset(node).set('arrayValue', [0, 1, '2']);
		dataset(node).set('objValue', {aaa: 'AAA', value: 10});
		dataset(node).set({
			anotherValue: false,
			boolValue: true,
		});
		dataset(node, 'yyy').set('testValue', 'abc');
		expect(node.getAttribute('data-test-value')).toBeNull();
		expect(node.getAttribute('data-xxx-test-value')).toBe('-4.5');
		expect(node.getAttribute('data-xxx-array-value')).toBe('[0,1,"2"]');
		expect(node.getAttribute('data-xxx-obj-value')).toBe('{"aaa":"AAA","value":10}');
		expect(node.getAttribute('data-xxx-another-value')).toBe('false');
		expect(node.getAttribute('data-xxx-bool-value')).toBe('true');
		expect(node.getAttribute('data-yyy-test-value')).toBe('abc');
		dataset.setNs('');
	});

	it('remove', () => {
		const node = document.createElement('i');
		dataset.setNs('xxx-');
		node.setAttribute('data-test-value', '1');
		node.setAttribute('data-xxx-test-value', '2');
		node.setAttribute('data-yyy-test-value', '3');

		dataset(node).remove('testValue');
		expect(node.hasAttribute('data-test-value')).toBeTrue();
		expect(node.hasAttribute('data-xxx-test-value')).toBeFalse();
		expect(node.hasAttribute('data-yyy-test-value')).toBeTrue();
		dataset(node, 'yyy').remove('testValue');
		expect(node.hasAttribute('data-yyy-test-value')).toBeFalse();
		dataset(node, '').set('testValue', undefined);
		expect(node.hasAttribute('data-test-value')).toBeFalse();
		dataset.setNs('');
	});

	it('selector', () => {
		const node = document.createElement('i');
		dataset.setNs('xxx-');
		node.setAttribute('data-test-value', '1');
		node.setAttribute('data-xxx-test-value', 'false');
		node.setAttribute('data-xxx-test-value-x', '[0,"1"]');
		node.setAttribute('data-xxx-test-value', 'false');
		node.setAttribute('data-yyy-test-value-y', 'null');
		document.body.appendChild(node);
		let selector = dataset.selector('testValueX');
		expect(selector).toBe('[data-xxx-test-value-x]');
		expect(document.querySelector(selector)).toBe(node);
		selector = dataset.selector('testValueY', undefined, 'yyy');
		expect(selector).toBe('[data-yyy-test-value-y]');
		expect(document.querySelector(selector)).toBe(node);
		selector = dataset.selector('testValue', undefined, '');
		expect(selector).toBe('[data-test-value]');
		expect(document.querySelector(selector)).toBe(node);
		selector = dataset.selector('testValue', false);
		expect(selector).toBe('[data-xxx-test-value="false"]');
		expect(document.querySelector(selector)).toBe(node);
		selector = dataset.selector('testValueY', null, 'yyy');
		expect(selector).toBe('[data-yyy-test-value-y="null"]');
		expect(document.querySelector(selector)).toBe(node);
		selector = dataset.selector('testValueX', [0, '1']);
		expect(selector).toBe('[data-xxx-test-value-x="[0,\\"1\\"]"]');
		expect(document.querySelector(selector)).toBe(node);
		expect(dataset.attrName('testValueX')).toBe('data-xxx-test-value-x');
		expect(dataset.attrName('testValueX', 'yyy')).toBe('data-yyy-test-value-x');
		dataset.setNs('');
		document.body.removeChild(node);
	});
});
