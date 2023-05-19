const CssVars = window.nuff.CssVars;
const cssVars = window.nuff.cssVars;

describe('CssVars:', () => {
	it('Exported correctly', () => {
		expect(cssVars).toBeInstanceOf(Function);
		expect(cssVars(document.createElement('div'))).toBeInstanceOf(CssVars);
	});

	it('Interface', () => {
		const node = document.createElement('i');
		const vars = cssVars(node);
		expect(vars.has).toBeInstanceOf(Function);
		expect(vars.get).toBeInstanceOf(Function);
		expect(vars.getString).toBeInstanceOf(Function);
		expect(vars.set).toBeInstanceOf(Function);
		expect(vars.remove).toBeInstanceOf(Function);
	});

	it('Has', () => {
		const style = document.createElement('style');
		style.innerHTML = `
		.testNode {
			--testVar: 10;
		}

		.subTestNode {
			--anotherVar: 30;
		}
		`;
		document.body.appendChild(style);
		const testNode = document.createElement('div');
		testNode.classList.add('testNode');
		const subTestNode = document.createElement('div');
		subTestNode.classList.add('subTestNode');
		testNode.appendChild(subTestNode);
		document.body.appendChild(testNode);

		const testNodeVars = cssVars(testNode);
		const subTestNodeVars = cssVars(subTestNode);
		expect(testNodeVars.has('testVar')).toBeTrue();
		expect(testNodeVars.has('anotherVar')).toBeFalse();
		expect(testNodeVars.has('--testVar')).toBeTrue();
		expect(testNodeVars.has('--anotherVar')).toBeFalse();
		expect(subTestNodeVars.has('testVar')).toBeTrue();
		expect(subTestNodeVars.has('anotherVar')).toBeTrue();
		subTestNode.style.setProperty('--whatever', 10);
		expect(subTestNodeVars.has('whatever')).toBeTrue();
		expect(subTestNodeVars.has('--whatever')).toBeTrue();
		subTestNode.style.setProperty('--anotherVar', '');
		expect(subTestNodeVars.has('anotherVar')).toBeTrue();
		subTestNode.style.setProperty('--empty', '');
		expect(subTestNodeVars.has('empty')).toBeFalse();

		document.body.removeChild(style);
		document.body.removeChild(testNode);
	});

	it('getString', () => {
		const style = document.createElement('style');
		style.innerHTML = `
		.testNode {
			--testVar: 10;
			--stringVar: yes, this is a string;
		}

		.subTestNode {
			--testVar: '[20,  5]';
			--anotherVar:  {"a":"testA","b":"testB"};
		}
		`;
		document.body.appendChild(style);
		const testNode = document.createElement('div');
		testNode.classList.add('testNode');
		const subTestNode = document.createElement('div');
		subTestNode.classList.add('subTestNode');
		testNode.appendChild(subTestNode);
		document.body.appendChild(testNode);
		testNode.style.setProperty('--thirdVar', 'false');
		testNode.style.setProperty('--trueVar', 'true');

		const testNodeVars = cssVars(testNode);
		const subTestNodeVars = cssVars(subTestNode);

		expect(testNodeVars.getString('testVar')).toBe('10');
		expect(subTestNodeVars.getString('testVar')).toBeInstanceOf(String);
		expect(subTestNodeVars.getString('testVar')).toBe('[20,  5]');
		expect(subTestNodeVars.getString('anotherVar')).toBe('{"a":"testA","b":"testB"}');
		expect(testNodeVars.getString('thirdVar')).toBe('false');
		expect(testNodeVars.getString('--thirdVar')).toBe('false');
		expect(testNodeVars.getString('--stringVar')).toBe('yes, this is a string');
		expect(subTestNodeVars.getString('trueVar')).toBe('true');

		expect(subTestNodeVars.getString('inventedVar', 'default value')).toBe('default value');
		expect(subTestNodeVars.getString('inventedVar')).toBe('');

		document.body.removeChild(style);
		document.body.removeChild(testNode);
	});

	it('get', () => {
		const style = document.createElement('style');
		style.innerHTML = `
		.testNode {
			--testVar: 10;
			--stringVar: yes, this is a string;
		}

		.testNode::before {
			content: '';
			--testVar: 20;
		}

		.subTestNode {
			--testVar: '[20,  5]';
			--anotherVar: {"a":"testA","b":"testB"};
		}
		`;
		document.body.appendChild(style);
		const testNode = document.createElement('div');
		testNode.classList.add('testNode');
		const subTestNode = document.createElement('div');
		subTestNode.classList.add('subTestNode');
		testNode.appendChild(subTestNode);
		document.body.appendChild(testNode);
		testNode.style.setProperty('--thirdVar', 'false');
		testNode.style.setProperty('--trueVar', 'true');

		const testNodeVars = cssVars(testNode);
		const subTestNodeVars = cssVars(subTestNode);

		expect(testNodeVars.get('testVar')).toBe(10);
		expect(subTestNodeVars.get('testVar')).toBeInstanceOf(Array);
		expect(subTestNodeVars.get('testVar')).toEqual([20, 5]);
		expect(subTestNodeVars.get('anotherVar')).toEqual({b: 'testB', a: 'testA'});
		expect(testNodeVars.get('thirdVar')).toBeFalse();
		expect(testNodeVars.get('--thirdVar')).toBeFalse();
		expect(testNodeVars.get('--stringVar')).toBe('yes, this is a string');
		expect(subTestNodeVars.get('trueVar')).toBeTrue();

		expect(subTestNodeVars.get('inventedVar', 'default value')).toBe('default value');
		expect(subTestNodeVars.get('inventedVar')).toBe('');
		expect(cssVars(testNode, '::before').get('testVar')).toBe(20);

		document.body.removeChild(style);
		document.body.removeChild(testNode);
		expect(testNodeVars.get('thirdVar')).toBeFalse();
	});

	it('set', () => {
		const node = document.createElement('i');
		const nodeVars = cssVars(node);
		const computedStyle = getComputedStyle(node);
		document.body.appendChild(node);
		nodeVars.set('testValue', -4.5);
		nodeVars.set('arrayValue', [0, 1, '2']);
		nodeVars.set('objValue', {aaa: 'AAA', value: 10});
		nodeVars.set({
			anotherValue: false,
			boolValue: true,
		});
		expect(computedStyle.getPropertyValue('--testValue')).toBe('-4.5');
		expect(computedStyle.getPropertyValue('--arrayValue')).toBe('[0,1,"2"]');
		expect(computedStyle.getPropertyValue('--objValue')).toBe('{"aaa":"AAA","value":10}');
		expect(computedStyle.getPropertyValue('--anotherValue')).toBe('false');
		expect(computedStyle.getPropertyValue('--boolValue')).toBe('true');
		document.body.removeChild(node);
	});

	it('remove', () => {
		const node = document.createElement('i');
		const nodeVars = cssVars(node);
		const computedStyle = getComputedStyle(node);
		document.body.appendChild(node);
		nodeVars.set('testValue', -4.5);
		nodeVars.set('arrayValue', [0, 1, '2']);
		nodeVars.set('objValue', {aaa: 'AAA', value: 10});
		nodeVars.set({
			anotherValue: false,
			boolValue: true,
		});
		expect(computedStyle.getPropertyValue('--testValue')).toBe('-4.5');
		nodeVars.remove('testValue');
		nodeVars.remove('arrayValue');
		nodeVars.remove('objValue');
		nodeVars.remove('anotherValue');
		nodeVars.remove('boolValue');
		expect(computedStyle.getPropertyValue('--testValue')).toBe('');
		expect(computedStyle.getPropertyValue('--arrayValue')).toBe('');
		expect(computedStyle.getPropertyValue('--objValue')).toBe('');
		expect(computedStyle.getPropertyValue('--anotherValue')).toBe('');
		expect(computedStyle.getPropertyValue('--boolValue')).toBe('');
		document.body.removeChild(node);
	});
});
