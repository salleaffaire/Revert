const { Chain, Step } = require('./index.js')

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function up1() {
  console.log('Starting up 1')
  await sleep(2000)
  console.log('Done up 1')
  return true
}

async function up2() {
  console.log('Starting up 2')
  await sleep(2000)
  console.log('Done up 2')
  return true
}

async function down1() {
  console.log('Starting down 1')
  await sleep(2000)
  console.log('Done down 1')
  return true
}

async function down2() {
  console.log('Starting down 2')
  await sleep(2000)
  console.log('Done down 2')
  return true
}


const S1 = new Step(up1, down1, 'S1')
const S2 = new Step(up2, down2, 'S2')

const L = new Chain()

L.add(S1)
L.add(S2)

async function Run() {
  await L.run()
}


Run()