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
