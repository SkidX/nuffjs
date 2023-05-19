module.exports = {
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
		},
	},
	globals: {},
	env: {
		node: true,
		browser: true,
		commonjs: true,
		es6: true,
		jasmine: true,
	},
	extends: [],
	rules: Object.assign(
		{
			// GLOBAL RULES:

			// ERRORS:

			// enforce `return` statements in getters
			'getter-return': 'error',

			// 	disallow `await` inside of loops
			'no-await-in-loop': 'warn',

			// disallow assignment in conditional expressions
			'no-cond-assign': ['error', 'always'],

			// disallow use of constant expressions in conditions
			'no-constant-condition': 'warn',

			// disallow control characters in regular expressions
			'no-control-regex': 'error',

			// disallow use of debugger
			'no-debugger': 'warn',

			// disallow duplicate arguments in functions
			'no-dupe-args': 'error',

			// disallow duplicate keys when creating object literals
			'no-dupe-keys': 'error',

			// disallow a duplicate case label.
			'no-duplicate-case': 'error',

			// disallow empty statements
			'no-empty': 'error',

			// disallow the use of empty character classes in regular expressions
			'no-empty-character-class': 'error',

			// disallow assigning to the exception in a catch block
			'no-ex-assign': 'error',

			// disallow double-negation boolean casts in a boolean context
			'no-extra-boolean-cast': 'warn',

			// disallow unnecessary parentheses
			// http://eslint.org/docs/rules/no-extra-parens
			'no-extra-parens': ['error', 'functions'],

			// disallow unnecessary semicolons
			'no-extra-semi': 'error',

			// disallow overwriting functions written as function declarations
			'no-func-assign': 'error',

			// disallow assigning to imported bindings
			'no-import-assign': 'error',

			// disallow function or variable declarations in nested blocks
			'no-inner-declarations': 'error',

			// disallow invalid regular expression strings in the RegExp constructor
			'no-invalid-regexp': 'error',

			// disallow irregular whitespace outside of strings and comments
			'no-irregular-whitespace': 'error',

			// disallow characters which are made with multiple code points in character class syntax
			'no-misleading-character-class': 'error',

			// disallow the use of object properties of the global object (Math and JSON) as functions
			'no-obj-calls': 'error',

			// disallow multiple spaces in a regular expression literal
			'no-regex-spaces': 'error',

			// disallow returning values from setters
			'no-setter-return': 'error',

			// disallow sparse arrays
			'no-sparse-arrays': 'error',

			// disallow unreachable statements after a return, throw, continue, or break statement
			'no-unreachable': 'error',

			// disallow negating the left operand of relational operators
			// http://eslint.org/docs/rules/no-unsafe-negation
			'no-unsafe-negation': 'error',

			// disallow comparisons with the value NaN
			'use-isnan': 'error',

			// ensure that the results of typeof are compared against a valid string
			// http://eslint.org/docs/rules/valid-typeof
			'valid-typeof': 'error',

			// BEST PRACTICES:

			// enforces return statements in callbacks of array's methods
			// http://eslint.org/docs/rules/array-callback-return
			'array-callback-return': 'error',

			// treat var statements as if they were block scoped
			'block-scoped-var': 'error',

			// require return statements to either always or never specify values
			'consistent-return': 'error',

			// specify curly brace conventions for all control statements
			curly: ['error', 'all'],

			// enforce default parameters to be last
			'default-param-last': 'error',

			// enforces consistent newlines before or after dots
			// http://eslint.org/docs/rules/dot-location
			'dot-location': ['warn', 'property'],

			// encourages use of dot notation whenever possible
			'dot-notation': ['warn', {allowKeywords: true}],

			// require the use of === and !==
			// http://eslint.org/docs/rules/eqeqeq
			eqeqeq: ['warn', 'always', {null: 'ignore'}],

			// make sure for-in loops have an if statement
			'guard-for-in': 'error',

			// disallow the use of alert, confirm, and prompt
			'no-alert': 'warn',

			// disallow use of arguments.caller or arguments.callee
			'no-caller': 'error',

			// disallow division operators explicitly at beginning of regular expression
			// http://eslint.org/docs/rules/no-div-regex
			'no-div-regex': 'warn',

			// disallow comparisons to null without a type-checking operator
			'no-eq-null': 'error',

			// disallow use of eval()
			'no-eval': 'error',

			// disallow adding to native types
			'no-extend-native': 'error',

			// disallow unnecessary function binding
			'no-extra-bind': 'error',

			// disallow Unnecessary Labels
			// http://eslint.org/docs/rules/no-extra-label
			'no-extra-label': 'error',

			// disallow fallthrough of case statements
			'no-fallthrough': ['warn', {commentPattern: 'break'}],

			// disallow the use of leading or trailing decimal points in numeric literals
			'no-floating-decimal': 'error',

			// disallow assignments to native objects or read-only global variables
			'no-global-assign': 'error',

			// disallow implicit type conversions
			// http://eslint.org/docs/rules/no-implicit-coercion
			'no-implicit-coercion': ['warn', {allow: ['!!', '+', '*']}],

			// disallow use of eval()-like methods
			'no-implied-eval': 'error',

			// disallow usage of __iterator__ property
			'no-iterator': 'error',

			// disallow use of labels for anything other then loops and switches
			'no-labels': ['error', {allowLoop: false, allowSwitch: false}],

			// disallow unnecessary nested blocks
			'no-lone-blocks': 'error',

			// disallow creation of functions within loops
			'no-loop-func': 'error',

			// disallow use of multiline strings
			'no-multi-str': 'error',

			// disallow use of new operator when not part of the assignment or comparison
			'no-new': 'error',

			// disallow use of new operator for Function object
			'no-new-func': 'error',

			// disallows creating new instances of String, Number, and Boolean
			'no-new-wrappers': 'error',

			// disallow use of (old style) octal literals
			'no-octal': 'error',

			// disallow use of octal escape sequences in string literals, such as
			// var foo = 'Copyright \251';
			'no-octal-escape': 'error',

			// disallow usage of __proto__ property
			'no-proto': 'error',

			// disallow declaring the same variable more then once
			'no-redeclare': 'error',

			// disallow use of assignment in return statement
			'no-return-assign': 'error',

			// disallow use of `javascript:` urls.
			'no-script-url': 'error',

			// disallow comparisons where both sides are exactly the same
			'no-self-compare': 'error',

			// disallow use of comma operator
			'no-sequences': 'error',

			// restrict what can be thrown as an exception
			'no-throw-literal': 'error',

			// disallow unmodified conditions of loops
			// http://eslint.org/docs/rules/no-unmodified-loop-condition
			'no-unmodified-loop-condition': 'error',

			// disallow usage of expressions in statement position
			'no-unused-expressions': 'error',

			// disallow unused labels
			// http://eslint.org/docs/rules/no-unused-labels
			'no-unused-labels': 'error',

			// disallow unnecessary string escaping
			// http://eslint.org/docs/rules/no-useless-escape
			'no-useless-escape': 'warn',

			// disallow usage of configurable warning terms in comments: e.g. todo
			'no-warning-comments': ['off'],

			// disallow use of the with statement
			'no-with': 'error',

			// require use of the second argument for parseInt()
			radix: 'error',

			// require immediate function invocation to be wrapped in parentheses
			// http://eslint.org/docs/rules/wrap-iife.html
			'wrap-iife': ['error', 'outside'],

			// require or disallow Yoda conditions
			yoda: 'error',

			// VARIABLES:

			// disallow deletion of variables
			'no-delete-var': 'error',

			// disallow labels that share a name with a variable
			// http://eslint.org/docs/rules/no-label-var
			'no-label-var': 'error',

			// disallow declaration of variables already declared in the outer scope
			'no-shadow': 'error',

			// disallow shadowing of names such as arguments
			'no-shadow-restricted-names': 'error',

			// disallow use of undeclared variables unless mentioned in a /*global */ block
			'no-undef': 'error',

			// disallow declaration of variables that are not used in the code
			'no-unused-vars': ['error', {vars: 'all', args: 'none'}],

			// disallow use of variables before they are defined
			'no-use-before-define': ['warn', {functions: false}],

			// STYLE:

			// enforce linebreaks after opening and before closing array brackets
			'array-bracket-newline': ['error', 'consistent'],

			// enforce spacing inside array brackets
			'array-bracket-spacing': ['error', 'never'],

			//disallow or enforce spaces inside of blocks after opening block and before closing block
			'block-spacing': ['error', 'always'],

			// enforce one true brace style
			'brace-style': ['error', '1tbs', {allowSingleLine: true}],

			// require camel case names
			camelcase: ['warn', {properties: 'never'}],

			// enforce spacing before and after comma
			'comma-spacing': ['error', {before: false, after: true}],

			// enforce one true comma style
			'comma-style': ['error', 'last'],

			// disallow padding inside computed properties
			'computed-property-spacing': ['error', 'never'],

			// enforce newline at the end of file, with no multiple empty lines
			'eol-last': ['error', 'always'],

			// require or disallow spacing between function identifiers and their invocations
			'func-call-spacing': ['error', 'never'],

			// enforce consistent line breaks inside function parentheses
			'function-paren-newline': ['error', 'multiline'],

			// enforce consistent indentation
			indent: ['error', 'tab', {SwitchCase: 1}],

			// enforce consistent spacing between keys and values in object literal properties
			'key-spacing': ['error', {beforeColon: false, afterColon: true}],

			// enforce consistent spacing before and after keywords
			'keyword-spacing': ['error', {before: true, after: true}],

			// require or disallow an empty line between class members
			'lines-between-class-members': 'error',

			// enforce a maximum number of statements allowed per line
			'max-statements-per-line': 'error',

			// require a capital letter for constructors
			'new-cap': [
				'error',
				{
					newIsCap: true,
					capIsNew: false,
					capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
				},
			],

			// disallow the omission of parentheses when invoking a constructor with no arguments
			// http://eslint.org/docs/rules/new-parens
			'new-parens': ['warn', 'always'],

			// disallow use of bitwise operators
			// http://eslint.org/docs/rules/no-bitwise
			'no-bitwise': 'warn',

			// disallow mixed spaces and tabs for indentation
			'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],

			// disallow use of chained assignment expressions
			'no-multi-assign': 'error',

			// disallow multiple empty lines and only one newline at the end
			'no-multiple-empty-lines': ['warn', {max: 3, maxBOF: 0, maxEOF: 1}],

			// disallow use of the Object constructor
			'no-new-object': 'error',

			// disallow space between function identifier and application
			'no-spaced-func': 'error',

			// disallow trailing whitespace at the end of lines
			'no-trailing-spaces': 'error',

			// disallow the use of Boolean literals in conditional expressions
			// also, prefer `a || b` over `a ? a : b`
			// http://eslint.org/docs/rules/no-unneeded-ternary
			'no-unneeded-ternary': ['warn', {defaultAssignment: true}],

			// disallow whitespace before properties
			// http://eslint.org/docs/rules/no-whitespace-before-property
			'no-whitespace-before-property': 'error',

			// require padding inside curly braces
			'object-curly-spacing': ['error', 'never'],

			// allow just one var statement per function
			'one-var': ['error', 'never'],

			// require a newline around variable declaration
			// http://eslint.org/docs/rules/one-var-declaration-per-line
			'one-var-declaration-per-line': ['error', 'always'],

			// require quotes around object literal property names
			// http://eslint.org/docs/rules/quote-props.html
			'quote-props': ['error', 'as-needed', {keywords: false, unnecessary: true, numbers: false}],

			// specify whether double or single quotes should be used
			quotes: ['warn', 'single', {avoidEscape: true}],

			// require or disallow use of semicolons instead of ASI
			semi: ['error', 'always'],

			// enforce spacing before and after semicolons
			'semi-spacing': ['error', {before: false, after: true}],

			// sort variables within the same declaration block
			'sort-vars': 'off',

			// require or disallow space before blocks
			'space-before-blocks': ['error', 'always'],

			// require or disallow space before function opening parenthesis
			// http://eslint.org/docs/rules/space-before-function-paren
			'space-before-function-paren': [
				'error',
				{
					anonymous: 'always',
					named: 'never',
					asyncArrow: 'always',
				},
			],

			// require or disallow spaces inside parentheses
			'space-in-parens': ['warn', 'never'],

			// require spaces around operators
			// HS wants [k-1] and (a>0 && expr)
			'space-infix-ops': 'warn',

			// require or disallow the Unicode Byte Order Mark
			// http://eslint.org/docs/rules/unicode-bom
			'unicode-bom': ['error', 'never'],

			// ES6:

			// enforces no braces where they can be omitted
			// http://eslint.org/docs/rules/arrow-body-style
			'arrow-body-style': ['warn', 'as-needed'],

			// require parens in arrow function arguments
			// http://eslint.org/docs/rules/arrow-parens
			'arrow-parens': 'error',

			// require space before/after arrow function's arrow
			// http://eslint.org/docs/rules/arrow-spacing
			'arrow-spacing': ['error', {before: true, after: true}],

			// verify super() callings in constructors
			'constructor-super': ['error'],

			// disallow modifying variables of class declarations
			// http://eslint.org/docs/rules/no-class-assign
			'no-class-assign': 'error',

			// disallow arrow functions where they could be confused with comparisons
			// http://eslint.org/docs/rules/no-confusing-arrow
			'no-confusing-arrow': ['error', {allowParens: true}],

			// disallow modifying variables that are declared using const
			'no-const-assign': 'error',

			// disallow duplicate class members
			'no-dupe-class-members': 'error',

			// disallow importing from the same path more than once
			// http://eslint.org/docs/rules/no-duplicate-imports
			'no-duplicate-imports': 'warn',

			// disallow symbol constructor
			// http://eslint.org/docs/rules/no-new-symbol
			'no-new-symbol': 'error',

			// disallow to use this/super before super() calling in constructors.
			// http://eslint.org/docs/rules/no-this-before-super
			'no-this-before-super': 'error',

			// disallow unnecessary constructor
			// http://eslint.org/docs/rules/no-useless-constructor
			'no-useless-constructor': 'error',

			// require let or const instead of var
			'no-var': 'warn',

			// require method and property shorthand syntax for object literals
			// http://eslint.org/docs/rules/object-shorthand
			'object-shorthand': ['warn', 'never'],

			// suggest using arrow functions as callbacks
			'prefer-arrow-callback': 'warn',

			// suggest using of const declaration for variables that are never modified after declared
			'prefer-const': 'warn',

			// use rest parameters instead of arguments
			// http://eslint.org/docs/rules/prefer-rest-params
			'prefer-rest-params': 'error',

			// enforce usage of spacing in template strings
			// http://eslint.org/docs/rules/template-curly-spacing
			'template-curly-spacing': 'error',

			// enforce spacing around the * in yield* expressions
			// http://eslint.org/docs/rules/yield-star-spacing
			'yield-star-spacing': ['error'],
		},
		{
			// PROJECT SPECIFIC OVERRIDES:
			// 'no-var': 'off',
			// 'prefer-arrow-callback': 'off',
		}
	),
};
