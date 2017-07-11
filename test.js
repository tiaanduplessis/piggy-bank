/* eslint-env jest */
'use strict'

const del = require('del')
const createStore = require('./index')

let store

beforeEach(() => {
  store = createStore()
})

test('should create a store', () => {
  expect(createStore).toBeDefined()
  expect(typeof createStore).toBe('function')
  expect(store).toBeDefined()
  expect(typeof store).toBe('object')
})

test('should set and get', () => {
  store.set('foo', 1)
  expect(store.get('foo')).toBe(1)
})

afterEach(() => {
  del('piggyBank.json')
})
