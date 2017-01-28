'use strict'

const fs = require('graceful-fs')
const fstorm = require('fstorm')

/**
 * Write to a JSON file sync
 */
const write = (file, obj) => {
  /**
   * Using fstorm for file writing
   */
  const data = JSON.stringify(obj)
  const writer = fstorm(file)

  writer.write(data, (err, status) => {
    if (err) { throw err }
    return status === 1
  })
}

/**
 * Read from a JSON file sync & parse the JSON
 */
const read = (file) => {
  if (fs.existsSync(file)) {
    try {
      const data = fs.readFileSync(file, 'utf-8').trim() || {}
      return JSON.parse(data)
    } catch (e) {
      throw e
    }
  } else {
    fs.writeFileSync(file, '{}')
  }
}

module.exports.read = read
module.exports.write = write
