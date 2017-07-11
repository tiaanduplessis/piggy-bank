<div align="center">
  <img src="media/banner.png" alt="piggy-bank">
</div>
<br>
<div align="center">
  <strong>🐷 Just a local, JSON based store 🐷</strong>
</div>
<br>
<div align="center">
    <a href="https://npmjs.org/package/piggy-bank">
      <img src="https://img.shields.io/npm/v/piggy-bank.svg?style=flat-square" alt="NPM version" />
    </a>
    <a href="https://npmjs.org/package/piggy-bank">
    <img src="https://img.shields.io/npm/dm/piggy-bank.svg?style=flat-square" alt="Downloads" />
    </a>
    <a href="https://github.com/feross/standard">
      <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard" />
    </a>
    <a href="https://travis-ci.org/tiaanduplessis/piggy-bank">
      <img src="https://img.shields.io/travis/tiaanduplessis/piggy-bank/master.svg?style=flat-square" alt="Travis build" />
    </a>
    <a href="https://github.com/RichardLitt/standard-readme)">
      <img src="https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square" alt="Standard Readme" />
    </a>
    <a href="https://badge.fury.io/gh/tiaanduplessis%2Fpiggy-bank">
      <img src="https://badge.fury.io/gh/tiaanduplessis%2Fpiggy-bank.svg?style=flat-square" alt="GitHub version" />
   </a>
</div>
<br>
<div align="center">
  Built with ❤︎ by <a href="tiaanduplessis.co.za">Tiaan du Plessis</a> and <a href="https://github.com/tiaanduplessis/piggy-bank/graphs/contributors">contributors</a>
</div>

<h2>Table of Contents</h2>
<details>
  <summary>Table of Contents</summary>
  <li><a href="#motivation">Motivation</a></li>
  <li><a href="#features">Features</a></li>
  <li><a href="#install">Install</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#api">API</a></li>
  <li><a href="#contribute">Contribute</a></li>
  <li><a href="#license">License</a></li>
</details>

## Motivation

This module provides a simple local persistence option for cases when that is all you need.

## Features

- Simple local persistence in a JSON file you specify
- Small API
- Supports retreival of properties using regexp or dot path notation
- Supports setting properties using dot path notation

## Install

```sh
$ npm install --save piggy-bank
```

```sh
$ yarn add piggy-bank
```

## Usage

```js

const piggyBank = require('piggy-bank')() // Creates a new JSON file with the name provided else it defaults to piggyBank.json

// Set properties on JSON file
piggyBank.set('foo', 1)
piggyBank.set('bar.baz', 1)
piggyBank.set('baz.foo.bar', 1)
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

```

## API - WIP

## Contribute

Contributions are welcome. Please open up an issue or create PR if you would like to help out.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

Licensed under the MIT License.