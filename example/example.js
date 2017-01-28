const piggyBank = require('../index')()

// overwrite set to true for running multiple times with nodemon
piggyBank.set('foo', 1, {overwrite: true})
piggyBank.set('bar.baz', 1, {overwrite: true})
piggyBank.set('baz.foo.bar', 1, {overwrite: true})
piggyBank.set('bar.foo', 1, {overwrite: true})

// Get the entire store
console.log(piggyBank.store())

// Get from store using dot path notation or regular expressions
console.log(piggyBank.get('foo'))
console.log(piggyBank.get('bar'))
console.log(piggyBank.get('baz'))
console.log(piggyBank.get('notDefined'))
console.log(piggyBank.get('baz.foo'))
console.log(piggyBank.get(/foo/))
console.log(piggyBank.get(/bar/))

// Set a new store
const store = {
  foo: 1,
  bar: 2,
  baz: 3
}

console.log(piggyBank.store(store))