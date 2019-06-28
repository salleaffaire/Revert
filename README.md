# Revertit

A reversible promise chain.

Construct a sequence of execution steps that can either succeed of fail. If one steps fail, automaticlaly undo the chain in the reverse order.
Each steps consists of 2 functions returning a Promise: one for the up stage and one for the down stage.

(This is an alpha release)

## Install

`npm install revertit`

## Example

```node
const { Chain, Step } = require('revertit')

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function up (opts) {
  await sleep(100)
  return opts.rval
}

async function down (opts) {
  await sleep(100)
  return opts.rval
}

// Create 2 steps called S1 and S2
//
// S1 will run `up` during the up stage passing `{ rval: true }` as parameters
// S1 will run `down` during the down stage passing `{ rval: true }` as parameters
//
// S2 will run `up` during the up stage passing `{ rval: false }` as parameters
// S2 will run `down` during the down stage passing `{ rval: true }` as parameters

let S1 = new Step(up, down, 'S1', { up: { rval: true }, down: { rval: true } })
let S2 = new Step(up, down, 'S2', { up: { rval: false }, down: { rval: true } })

// Instanciates a new chain
let L = new Chain()

// Add the 2 steps to the chain
L.add(S1)
L.add(S2)

// Run the chain
L.run()
  .then(data => {
    console.log(data)
  })
  .catch(e => {

  })

// This outputs the stack trace which is returned by the execution of the chain
// [
//   { stepIndex: 0, type: 'up', result: true },
//   { stepIndex: 1, type: 'up', result: false },
//   { stepIndex: 1, type: 'down', result: true },
//   { stepIndex: 0, type: 'down', result: true }
// ]

```
