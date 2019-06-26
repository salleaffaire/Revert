/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */ // this is needed to instruct lint to ignore 'chai.expect' syntax for expression errors

'use strict'

// const chai = require('chai')
// const expect = chai.expect

const { Chain, Step } = require('../index.js')

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function up1 () {
  await sleep(100)
  return true
}

async function up2 () {
  await sleep(100)
  return true
}

async function down1 () {
  await sleep(100)
  return true
}

async function down2 () {
  await sleep(100)
  return true
}

const S1 = new Step(up1, down1, 'S1')
const S2 = new Step(up2, down2, 'S2')

const L = new Chain()

L.add(S1)
L.add(S2)

async function Run () {
  return L.run()
}

describe('Run a 2-Step chain', function () {
  const iterations = [
    {
      sResults: [true, true],
      expected: {}
    }]

  for (let itr in iterations) {
    console.log({ itr })
    it(' ... without errors', done => {
      Run()
        .then((data) => {
          console.log({ data })
          done()
        })
        .catch((e) => {
          done(e)
        })
    })
  }
})
