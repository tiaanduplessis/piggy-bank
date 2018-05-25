
# piggy-bank 🐷
[![package version](https://img.shields.io/npm/v/piggy-bank.svg?style=flat-square)](https://npmjs.org/package/piggy-bank)
[![package downloads](https://img.shields.io/npm/dm/piggy-bank.svg?style=flat-square)](https://npmjs.org/package/piggy-bank)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![package license](https://img.shields.io/npm/l/piggy-bank.svg?style=flat-square)](https://npmjs.org/package/piggy-bank)
[![make a pull request](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> Simple, local JSON file store

## Table of Contents

- [About](#about)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#License)

## About

- Simple local persistence in a JSON file you specify
- Small API of `set`, `get`, `remove` & `store`
- Supports retreival of properties using regexp or dot path notation
- Supports setting properties using dot path notation

## Install

This project uses [node](https://nodejs.org) and [npm](https://www.npmjs.com). 

```sh
$ npm install piggy-bank
$ # OR
$ yarn add piggy-bank
```

## Usage

```js
const piggyBank = require('piggy-bank')() // Creates a new JSON file at the path provided
                                          // Defaults to .piggy.json in OS home dir

// Set properties on JSON file
piggyBank.set('foo', 1)
piggyBank.set('bar.baz', 1)
piggyBank.set('baz.foo.bar', 5)
piggyBank.set('baz.foo.bar', 1, {overwrite: true}) // Force
piggyBank.set('bar.foo', 1)

// Get the entire store
console.log(piggyBank.store()) // { foo: 1, bar: { baz: 1, foo: 1 }, baz: { foo: { bar: 1 } } }

// Get from store using dot path notation or regular expressions
console.log(piggyBank.get('foo')) // 1
console.log(piggyBank.get('bar')) // { baz: 1, foo: 1 }
console.log(piggyBank.get('baz')) // { foo: { bar: 1 } }
console.log(piggyBank.get('notDefined')) // undefined
console.log(piggyBank.get('baz.foo')) // { bar: 1 }
console.log(piggyBank.get(/foo/)) // [ 1, 1, { bar: 1 } ]
console.log(piggyBank.get(/bar/)) // { foo: 1, bar: 2, baz: 3 }

// Set a new store
const store = {
  foo: 1,
  bar: 2,
  baz: 3
}

console.log(piggyBank.store(store)) // { foo: 1, bar: 2, baz: 3 }

piggyBank.remove('foo') // Remove key
```

## Contribute

1. Fork it and create your feature branch: git checkout -b my-new-feature
2. Commit your changes: git commit -am 'Add some feature'
3. Push to the branch: git push origin my-new-feature 
4. Submit a pull request

## License

MIT
    