const ClassList = window.nuff.ClassList;
const classList = window.nuff.classList;

describe('ClassList:', () => {
	it('Exported correctly', () => {
		expect(classList).toBeInstanceOf(Function);
	});

	it('Exported correctly', () => {
		expect(ClassList).toBeInstanceOf(Function);
	});

	it('Namespace definition', () => {
		expect(classList.getNs()).toBe('');
		classList.setNs('xxx-');
		expect(classList.getNs()).toBe('xxx-');
		classList.setNs('');
	});

	it('Interface', () => {
		const node = document.createElement('i');
		const cl = classList(node);
		expect(cl.add).toBeInstanceOf(Function);
		expect(cl.remove).toBeInstanceOf(Function);
		expect(cl.contains).toBeInstanceOf(Function);
		expect(cl.replace).toBeInstanceOf(Function);
		expect(cl.toggle).toBeInstanceOf(Function);
		expect(cl.entries).toBeInstanceOf(Function);
		expect(cl.values).toBeInstanceOf(Function);
		expect(cl.keys).toBeInstanceOf(Function);
		expect(cl.item).toBeInstanceOf(Function);
		expect(cl.length).toBeInstanceOf(Number);
		expect(cl.value).toBeInstanceOf(String);
	});

	it('Add', () => {
		const node = document.createElement('i');
		const cl = node.classList;
		classList.setNs('xxx-');
		classList(node).add('aaa');
		classList(node, 'yyy-').add('aaa');
		classList(node).add('bbb', 'ccc', 'ddd');
		classList(node, 'yyy-').add('bbb', 'ccc', 'ddd');
		new ClassList(node).add('eee');
		new ClassList(node, 'zzz-').add('fff');
		expect(cl.contains('xxx-aaa')).toBeTrue();
		expect(cl.contains('xxx-bbb')).toBeTrue();
		expect(cl.contains('xxx-ccc')).toBeTrue();
		expect(cl.contains('xxx-ddd')).toBeTrue();
		expect(cl.contains('yyy-aaa')).toBeTrue();
		expect(cl.contains('yyy-bbb')).toBeTrue();
		expect(cl.contains('yyy-ccc')).toBeTrue();
		expect(cl.contains('yyy-ddd')).toBeTrue();
		expect(cl.contains('xxx-eee')).toBeTrue();
		expect(cl.contains('zzz-fff')).toBeTrue();
		classList.setNs('');
		classList(node).add('aaa');
		expect(cl.contains('aaa')).toBeTrue();
	});

	it('Remove', () => {
		const node = document.createElement('i');
		const cl = node.classList;
		[
			'aaa',
			'xxx-aaa',
			'xxx-bbb',
			'xxx-ccc',
			'xxx-ddd',
			'yyy-aaa',
			'yyy-bbb',
			'yyy-ccc',
			'yyy-ddd',
		].map((name) => cl.add(name));
		classList.setNs('xxx-');
		classList(node).remove('aaa');
		classList(node, 'yyy-').remove('aaa');
		classList(node).remove('bbb', 'ccc', 'ddd');
		classList(node, 'yyy-').remove('bbb', 'ccc', 'ddd');
		expect(cl.contains('xxx-aaa')).toBeFalse();
		expect(cl.contains('xxx-bbb')).toBeFalse();
		expect(cl.contains('xxx-ccc')).toBeFalse();
		expect(cl.contains('xxx-ddd')).toBeFalse();
		expect(cl.contains('yyy-aaa')).toBeFalse();
		expect(cl.contains('yyy-bbb')).toBeFalse();
		expect(cl.contains('yyy-ccc')).toBeFalse();
		expect(cl.contains('yyy-ddd')).toBeFalse();
		classList.setNs('');
		classList(node).remove('aaa');
		expect(cl.contains('aaa')).toBeFalse();
	});

	it('Contains', () => {
		const node = document.createElement('i');
		const cl = node.classList;
		[
			'xxx',
			'zzz',
			'xxx-aaa',
			'xxx-bbb',
			'xxx-ccc',
			'xxx-ddd',
			'yyy-aaa',
			'yyy-bbb',
			'yyy-ccc',
			'yyy-ddd',
		].map((name) => cl.add(name));

		classList.setNs('xxx-');
		expect(classList(node).contains('xxx')).toBeFalse();
		expect(classList(node).contains('zzz')).toBeFalse();
		expect(classList(node).contains('aaa')).toBeTrue();
		expect(classList(node, 'yyy-').contains('aaa')).toBeTrue();
		expect(classList(node).contains('bbb')).toBeTrue();
		expect(classList(node, 'yyy-').contains('bbb')).toBeTrue();
		expect(classList(node).contains('ccc')).toBeTrue();
		expect(classList(node, 'yyy-').contains('ccc')).toBeTrue();
		expect(classList(node).contains('ddd')).toBeTrue();
		expect(classList(node, 'yyy-').contains('ddd')).toBeTrue();
		classList.setNs('');
		expect(classList(node).contains('xxx')).toBeTrue();
		expect(classList(node).contains('zzz')).toBeTrue();
	});

	it('Toggle', () => {
		const node = document.createElement('i');
		const cl = node.classList;
		['aaa', 'bbb', 'ccc', 'xxx-aaa', 'xxx-bbb', 'xxx-ccc', 'yyy-aaa', 'yyy-bbb', 'xxx-ccc'].map(
			(name) => cl.add(name)
		);

		classList.setNs('xxx-');
		expect(classList(node).toggle('aaa')).toBeFalse();
		classList(node, 'yyy-').toggle('aaa');
		expect(classList(node).toggle('bbb', false)).toBeFalse();
		classList(node, 'yyy-').toggle('bbb', false);
		expect(classList(node).toggle('ccc', true)).toBeTrue();
		expect(classList(node, 'yyy-').toggle('ccc', true)).toBeTrue();
		classList(node).toggle('ddd', true);
		classList(node, 'yyy-').toggle('ddd', true);
		classList(node).toggle('eee');
		classList(node, 'yyy-').toggle('eee');
		classList.setNs('');
		classList(node).toggle('aaa');
		classList(node).toggle('bbb', false);
		classList(node).toggle('ccc');
		expect(cl.contains('aaa')).toBeFalse();
		expect(cl.contains('bbb')).toBeFalse();
		expect(cl.contains('ccc')).toBeFalse();
		expect(cl.contains('xxx-aaa')).toBeFalse();
		expect(cl.contains('xxx-bbb')).toBeFalse();
		expect(cl.contains('xxx-ccc')).toBeTrue();
		expect(cl.contains('xxx-ddd')).toBeTrue();
		expect(cl.contains('xxx-eee')).toBeTrue();
		expect(cl.contains('yyy-aaa')).toBeFalse();
		expect(cl.contains('yyy-bbb')).toBeFalse();
		expect(cl.contains('yyy-ccc')).toBeTrue();
		expect(cl.contains('yyy-ddd')).toBeTrue();
		expect(cl.contains('yyy-eee')).toBeTrue();
	});

	it('Replace', () => {
		const node = document.createElement('i');
		const cl = node.classList;
		['aaa', 'bbb', 'xxx-aaa', 'xxx-bbb', 'yyy-aaa', 'yyy-bbb'].map((name) => cl.add(name));

		classList.setNs('xxx-');
		expect(classList(node).replace('aaa', 'ccc')).toBeTrue();
		expect(classList(node, 'yyy-').replace('aaa', 'ccc')).toBeTrue();
		expect(classList(node).replace('zzz', 'ddd')).toBeFalse();
		expect(classList(node, 'yyy-').replace('zzz', 'ddd')).toBeFalse();
		expect(classList(node).replace('ccc', 'eee')).toBeTrue();
		expect(classList(node, 'yyy-').replace('ccc', 'eee')).toBeTrue();
		expect(cl.contains('aaa')).toBeTrue();
		classList.setNs('');
		classList(node).replace('aaa', 'ccc');
		expect(cl.contains('aaa')).toBeFalse();
		expect(cl.contains('bbb')).toBeTrue();
		expect(cl.contains('ccc')).toBeTrue();
		expect(cl.contains('xxx-aaa')).toBeFalse();
		expect(cl.contains('xxx-bbb')).toBeTrue();
		expect(cl.contains('xxx-ccc')).toBeFalse();
		expect(cl.contains('xxx-ddd')).toBeFalse();
		expect(cl.contains('xxx-eee')).toBeTrue();
		expect(cl.contains('yyy-aaa')).toBeFalse();
		expect(cl.contains('yyy-bbb')).toBeTrue();
		expect(cl.contains('yyy-ccc')).toBeFalse();
		expect(cl.contains('yyy-ddd')).toBeFalse();
		expect(cl.contains('yyy-eee')).toBeTrue();
	});

	it('Iterators', () => {
		const node = document.createElement('i');
		const cl = node.classList;
		const fullRef = [
			'aaa',
			'bbb',
			'ccc',
			'xxx-aaa',
			'xxx-bbb',
			'xxx-ccc',
			'yyy-aaa',
			'yyy-bbb',
			'xxx-ccc',
		];
		fullRef.map((name) => cl.add(name));
		const ref = ['aaa', 'bbb', 'ccc'];
		classList.setNs('xxx-');
		let i = 0;
		for (const key of classList(node).keys()) {
			expect(key).toBe(i);
			i++;
		}
		i = 0;
		for (const value of classList(node).values()) {
			expect(value).toBe(ref[i]);
			i++;
		}
		i = 0;
		for (const [key, value] of classList(node).entries()) {
			expect(key).toBe(i);
			expect(value).toBe(ref[i]);
			i++;
		}
		expect(classList(node).item(1)).toBe('bbb');
		expect(classList(node).item(-1)).toBeNull();
		expect(classList(node).item(3)).toBeNull();
		i = 0;
		for (const key of classList(node, 'yyy-').keys()) {
			expect(key).toBe(i);
			i++;
		}
		i = 0;
		for (const value of classList(node, 'yyy-').values()) {
			expect(value).toBe(ref[i]);
			i++;
		}
		i = 0;
		for (const [key, value] of classList(node, 'yyy-').entries()) {
			expect(key).toBe(i);
			expect(value).toBe(ref[i]);
			i++;
		}
		expect(classList(node, 'yyy-').item(1)).toBe('bbb');
		expect(classList(node, 'yyy-').item(-1)).toBeNull();
		expect(classList(node, 'yyy-').item(3)).toBeNull();
		i = 0;
		classList.setNs('');
		for (const key of classList(node).keys()) {
			expect(key).toBe(i);
			i++;
		}
		i = 0;
		for (const value of classList(node).values()) {
			expect(value).toBe(fullRef[i]);
			i++;
		}
		i = 0;
		for (const [key, value] of classList(node).entries()) {
			expect(key).toBe(i);
			expect(value).toBe(fullRef[i]);
			i++;
		}
		i = 0;
		classList(node).forEach((value, key) => {
			expect(value).toBe(fullRef[i]);
			expect(key).toBe(i);
			i++;
		});

		const context = {};
		classList(node).forEach(function (value, key) {
			expect(this).toBe(context);
		}, context);

		expect(classList(node).item(1)).toBe('bbb');
		expect(classList(node).item(4)).toBe('xxx-bbb');
		expect(classList(node).item(-1)).toBeNull();
		expect(classList(node).item(12)).toBeNull();
	});

	it('Length', () => {
		const node = document.createElement('i');
		const cl = node.classList;
		expect(classList(node).length).toBe(0);
		const xxxRef = ['xxx-aaa', 'xxx-bbb', 'xxx-ccc'];
		const yyyRef = ['yyy-aaa', 'yyy-bbb', 'yyy-ccc'];
		const ref = ['aaa', 'bbb', 'ccc'].concat(xxxRef, yyyRef);
		ref.map((name) => cl.add(name));
		classList.setNs('xxx-');
		expect(classList(node).length).toBe(xxxRef.length);
		expect(classList(node, 'yyy-').length).toBe(yyyRef.length);
		classList.setNs('');
		expect(classList(node).length).toBe(ref.length);
	});

	it('Value', () => {
		const node = document.createElement('i');
		const cl = node.classList;
		expect(classList(node).value).toBe('');
		const xxxRef = ['xxx-aaa', 'xxx-bbb', 'xxx-ccc'];
		const yyyRef = ['yyy-aaa', 'yyy-bbb', 'yyy-ccc'];
		const baseRef = ['aaa', 'bbb', 'ccc'];
		const ref = baseRef.concat(xxxRef, yyyRef);
		ref.map((name) => cl.add(name));
		classList.setNs('xxx-');
		expect(classList(node).value).toBe(baseRef.join(' '));
		expect(classList(node, 'yyy-').value).toBe(baseRef.join(' '));
		classList.setNs('');
		expect(classList(node).value).toBe(ref.join(' '));
		node.className = '';
		expect(classList(node).value).toBe('');
		classList.setNs('xxx-');
		classList(node).value = 'aaa bbb    ccc';
		expect(node.className).toBe(xxxRef.join(' '));
		classList(node, 'yyy-').value = 'aaa   		 bbb ccc';
		expect(node.className).toBe(yyyRef.join(' '));
		classList.setNs('');
		classList(node).value = 'aaa bbb    ccc';
		expect(node.className).toBe(baseRef.join(' '));
	});

	it('Selector', () => {
		const node = document.createElement('i');
		const cl = node.classList;
		['aaa', 'bbb', 'ccc', 'xxx-aaa', 'xxx-bbb', 'xxx-ccc', 'yyy-aaa', 'yyy-bbb', 'yyy-ccc'].map(
			(name) => cl.add(name)
		);
		document.body.appendChild(node);

		classList.setNs('xxx-');
		let selector = classList.selector('aaa');
		expect(selector).toBe('.xxx-aaa');
		expect(document.querySelector(selector)).toBe(node);
		selector = classList.selector('aaa  bbb');
		expect(selector).toBe('.xxx-aaa.xxx-bbb');
		expect(document.querySelector(selector)).toBe(node);
		selector = classList.selector(['ccc', 'aaa']);
		expect(selector).toBe('.xxx-ccc.xxx-aaa');
		expect(document.querySelector(selector)).toBe(node);

		selector = classList.selector('aaa', 'yyy-');
		expect(selector).toBe('.yyy-aaa');
		expect(document.querySelector(selector)).toBe(node);
		selector = classList.selector('aaa  bbb', 'yyy-');
		expect(selector).toBe('.yyy-aaa.yyy-bbb');
		expect(document.querySelector(selector)).toBe(node);
		selector = classList.selector(['ccc', 'aaa'], 'yyy-');
		expect(selector).toBe('.yyy-ccc.yyy-aaa');
		expect(document.querySelector(selector)).toBe(node);

		classList.setNs('');
		selector = classList.selector('aaa');
		expect(selector).toBe('.aaa');
		expect(document.querySelector(selector)).toBe(node);
		selector = classList.selector('aaa  bbb');
		expect(selector).toBe('.aaa.bbb');
		expect(document.querySelector(selector)).toBe(node);
		selector = classList.selector(['ccc', 'aaa']);
		expect(selector).toBe('.ccc.aaa');
		expect(document.querySelector(selector)).toBe(node);

		document.body.removeChild(node);
	});

	it('ClassName', () => {
		expect(classList.getNs()).toBe('');
		expect(classList.className('test')).toBe('test');
		classList.setNs('xxx-');
		expect(classList.className('test')).toBe('xxx-test');
		expect(classList.className('test', 'js-')).toBe('js-test');
		classList.setNs('');
	});
});
