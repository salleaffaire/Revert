# Revert

A reversible promise chain

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

let S1 = new Step(up, down, 'S1', { up: { rval: true }, down: { rval: true } })
let S2 = new Step(up, down, 'S2', { up: { rval: false }, down: { rval: true } })

let L = new Chain()

console.log({ L })

L.add(S1)
L.add(S2)

L.run()
  .then(data => {
    console.log(data)
  })
  .catch(e => {

  })
```
