'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const createStore = require('./index')

let directory
let filePath
let store

beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'piggy-bank-'))
  filePath = path.join(directory, 'test.json')
  store = createStore(filePath)
})

test('should create a store', () => {
  expect(createStore).toBeDefined()
  expect(typeof createStore).toBe('function')
  expect(store).toBeDefined()
  expect(typeof store).toBe('object')
  expect(fs.existsSync(filePath)).toBeTruthy()
})

test('should set and get', () => {
  store.set('foo', 1)
  store.set('bar.baz', 2)
  expect(store.get('foo')).toBe(1)
  expect(store.get('bar.baz')).toBe(2)
})

test('should return entire store', () => {
  console.log(store.store())
  const obj = {
    foo: 1,
    bar: {
      baz: 2
    }
  }

  store.set('foo', 1)
  store.set('bar.baz', 2)

  expect(store.store()).toEqual(obj)
})

test('should throw if trying to overwrite key without flag', () => {
  store.set('foo', 1)
  expect(() => store.set('foo', 1)).toThrow()
})

test('should remove a value', () => {
  const key = 'foo'
  store.set(key, 1)
  store.remove(key)
  expect(store.get(key)).toBeUndefined()
})

afterEach(() => {
  try {
    fs.unlinkSync(filePath)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  fs.rmdirSync(directory)
})
