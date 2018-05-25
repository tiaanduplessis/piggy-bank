'use strict'

const path = require('path')
const fs = require('fs')
const dotProp = require('dot-prop')
const defaultPath = path.join(require('os').homedir(), '.pomd.json')
const search = require('obj-search')
const { readJSON, writeJSON } = require('json-reader-writer')

/**
 * Provide a read & write function for creating a new piggyBank function
 */
function createPiggyBank (read, write) {
  return function piggyBank (filePath = defaultPath, opts = {}) {
    let currentStore = {}

    if (!fs.existsSync(filePath)) {
      write(filePath, {})
    } else {
      currentStore = read(filePath)
    }

    const set = (key, value, opts = { overwrite: false }) => {
      if (dotProp.has(currentStore, key) && !opts.overwrite) {
        throw new Error(`Key "${key}" already exists in store`)
      }

      dotProp.set(currentStore, key, value)
      return write(filePath, currentStore)
    }

    const get = (key, defaultValue) => {
      return search(currentStore, key, defaultValue)
    }

    const remove = key => {
      dotProp.delete(currentStore, key)
      return write(filePath, currentStore)
    }

    const store = newStore => {
      if (newStore) {
        currentStore = newStore
        write(filePath, currentStore)
      }

      return currentStore
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
