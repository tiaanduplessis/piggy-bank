'use strict'

const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const createStore = require('../index')

let directory
let filename
let store

beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'piggy-bank-'))
  filename = path.join(directory, 'store.json')
  store = createStore(filename)
})

afterEach(() => {
  try {
    fs.unlinkSync(filename)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  fs.rmdirSync(directory)
})

test('nested values survive a reopened store', () => {
  assert.strictEqual(store.set('account.name', 'Ada'), true)
  assert.strictEqual(store.set('account.count', 3), true)
  const reopened = createStore(filename)
  assert.strictEqual(reopened.get('account.name'), 'Ada')
  assert.strictEqual(reopened.get('account.count'), 3)
  assert.deepStrictEqual(reopened.store(), { account: { name: 'Ada', count: 3 } })
})

;[false, 0, '', null].forEach(value => {
  test('falsy values retain overwrite protection: ' + JSON.stringify(value), () => {
    assert.strictEqual(store.set('nested.value', value), true)
    assert.strictEqual(store.get('nested.value'), value)
    assert.strictEqual(createStore(filename).get('nested.value'), value)
    assert.throws(() => store.set('nested.value', 'next'), /already exists/)
    assert.strictEqual(store.set('nested.value', 'next', { overwrite: true }), true)
    assert.strictEqual(store.get('nested.value'), 'next')
  })
})

test('removal preserves siblings, empty parents and the write return value', () => {
  store.set('parent.first', 1)
  store.set('parent.second', 2)
  assert.strictEqual(store.remove('parent.first'), true)
  assert.strictEqual(store.get('parent.first', 'missing'), 'missing')
  assert.strictEqual(store.get('parent.second'), 2)
  assert.strictEqual(store.remove('parent.second'), true)
  assert.deepStrictEqual(store.get('parent'), {})
  assert.strictEqual(store.remove('absent.child'), true)
  assert.deepStrictEqual(createStore(filename).store(), { parent: {} })
})

test('escaped dots preserve literal property names', () => {
  store.set('section\\.one.value', 7)
  assert.strictEqual(store.get('section\\.one.value'), 7)
  assert.deepStrictEqual(store.store(), { 'section.one': { value: 7 } })
  store.remove('section\\.one.value')
  assert.deepStrictEqual(store.store(), { 'section.one': {} })
})

test('existing arrays retain indexed updates and JSON persistence', () => {
  store.store({ list: [{ label: 'old' }, { label: 'keep' }] })
  store.set('list.0.label', 'new', { overwrite: true })
  assert.strictEqual(store.get('list.0.label'), 'new')
  assert.deepStrictEqual(createStore(filename).store(), {
    list: [{ label: 'new' }, { label: 'keep' }]
  })
})

test('search preserves scalar, multiple-match and no-match results', () => {
  store.store({ foo: 1, nested: { foo: 2, bar: 3 } })
  assert.deepStrictEqual(store.get(/foo/), [1, 2])
  assert.strictEqual(store.get(/bar/), 3)
  assert.deepStrictEqual(store.get(/absent/), [])
  assert.strictEqual(store.get('absent', 'fallback'), 'fallback')
})

test('store replacement retains its reference and persistence semantics', () => {
  const replacement = { nested: { value: 9 } }
  assert.strictEqual(store.store(replacement), replacement)
  assert.strictEqual(store.store(), replacement)
  assert.deepStrictEqual(createStore(filename).store(), replacement)
})

test('invalid search patterns and invalid JSON still fail visibly', () => {
  assert.throws(() => store.get(42), /Invalid pattern/)
  fs.writeFileSync(filename, '{invalid json')
  assert.throws(() => createStore(filename))
})

test('ordinary names containing protected words still work', () => {
  store.set('constructorValue.prototypeName', 'allowed')
  store.set('safe.__proto__Suffix', 'also allowed')
  assert.strictEqual(store.get('constructorValue.prototypeName'), 'allowed')
  assert.strictEqual(store.get('safe.__proto__Suffix'), 'also allowed')
})

function ownedObject () {
  // Every potential traversal target is fixture-owned, including constructors
  // and prototypes. Even a failed guard cannot touch Object.prototype.
  const inherited = { marker: 'inherited fixture' }
  const constructorPrototype = { marker: 'constructor fixture' }
  const prototype = { marker: 'prototype fixture' }
  const object = Object.create(inherited)
  object.constructor = { prototype: constructorPrototype }
  object.prototype = prototype
  return { object, inherited, constructorPrototype, prototype }
}

;['__proto__.marker', 'constructor.prototype.marker', 'prototype.marker'].forEach(key => {
  test('protected paths cannot read or change fixture-owned prototypes: ' + key, () => {
    const fixture = ownedObject()
    const root = fixture.object
    store.store(root)
    const before = fs.readFileSync(filename, 'utf8')
    assert.strictEqual(store.get(key), undefined)
    assert.strictEqual(store.set(key, 'changed'), true)
    assert.strictEqual(store.remove(key), true)
    assert.strictEqual(fixture.inherited.marker, 'inherited fixture')
    assert.strictEqual(fixture.constructorPrototype.marker, 'constructor fixture')
    assert.strictEqual(fixture.prototype.marker, 'prototype fixture')
    assert.strictEqual(Object.getPrototypeOf(root), fixture.inherited)
    assert.strictEqual(fs.readFileSync(filename, 'utf8'), before)
  })

  test('nested protected path segments are blocked: ' + key, () => {
    const fixture = ownedObject()
    store.store({ wrapper: fixture.object })
    const before = fs.readFileSync(filename, 'utf8')
    assert.strictEqual(store.get('wrapper.' + key), undefined)
    store.set('wrapper.' + key, 'changed')
    store.remove('wrapper.' + key)
    assert.strictEqual(fixture.inherited.marker, 'inherited fixture')
    assert.strictEqual(fixture.constructorPrototype.marker, 'constructor fixture')
    assert.strictEqual(fixture.prototype.marker, 'prototype fixture')
    assert.strictEqual(fs.readFileSync(filename, 'utf8'), before)
  })
})

test('protected own keys cannot be replaced or deleted through a dot path', () => {
  const fixture = ownedObject()
  store.store(fixture.object)
  const before = fs.readFileSync(filename, 'utf8')
  store.set('constructor', 'changed')
  store.remove('constructor')
  store.set('prototype', 'changed')
  store.remove('prototype')
  assert.strictEqual(fixture.object.constructor.prototype, fixture.constructorPrototype)
  assert.strictEqual(fixture.object.prototype, fixture.prototype)
  assert.strictEqual(fs.readFileSync(filename, 'utf8'), before)
})
