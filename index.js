'use strict'

const path = require('path')
const fs = require('graceful-fs')
const dotProp = require('dot-prop')
const defaultOpts = {}
const defaultPath = path.join(process.cwd(), 'piggyBank.json')
const search = require('obj-search')
const { readJSON, writeJSON } = require('json-reader-writer')

/**
 * Provide a read & write function for creating a new piggyBank function
 */
function createPiggyBank(read, write) {
  return function(filePath = defaultPath, opts = defaultOpts) {
    // Create file if it does not exist prior to read
    if (!fs.existsSync(filePath)) {
      write(filePath, {})
    }

    // Create new or read from existing JSON file
    let _store = read(filePath)

    /**
     * Set the key to value specified & write changes to file
     */
    const set = (key, value, opts = { overwrite: false }) => {
      // Check if key already exists & overwrite false
      if (dotProp.has(_store, key) && !opts.overwrite) {
        throw new Error('Key already exists in _store')
      }

      dotProp.set(_store, key, value)
      return write(filePath, _store)
    }

    /**
     * Retreive the specified key from store if it exists
     */
    const get = (key, opts = {}) => {
      return search(_store, key, opts.defaultValue)
    }

    /**
     * Remove the argument key from the store and write changes
     */
    const remove = key => {
      dotProp.delete(_store, key)
      return write(filePath, _store)
    }

    /**
     * Set the store based on provided newStore argument
     * or get the current store if no argument provided
     */
    const store = newStore => {
      if (newStore) {
        _store = newStore
        write(filePath, _store)
      }

      return _store
    }

    return {
      set,
      store,
      get,
      remove
    }
  }
}

module.exports = createPiggyBank(readJSON, writeJSON)
