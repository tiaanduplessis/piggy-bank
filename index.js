const {read, write} = require('./src/json-file-io')
const createPiggyBank = require('./src/create-piggy-bank')

module.exports = createPiggyBank(read, write)
