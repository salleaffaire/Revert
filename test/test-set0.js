/**
 * Revertit.
 *
 * Revert controls a series of steps called a chain. Each step must complete successfully for the chain to succeed.
 * If one fails, the whole chain is undone.
 *
 * @author Luc Martel.
 */

/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */ // this is needed to instruct lint to ignore 'chai.expect' syntax for expression errors

'use strict'

const chai = require('chai')
const expect = chai.expect

const { Chain, Step } = require('../index.js')

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

describe('Run a 2-Step chain', function () {
  const iterations = [{
    upResults: [true, true],
    expected: [
      { stepIndex: 0, type: 'up', result: true },
      { stepIndex: 1, type: 'up', result: true }
    ]
  }, {
    upResults: [true, false],
    expected: [
      { stepIndex: 0, type: 'up', result: true },
      { stepIndex: 1, type: 'up', result: false },
      { stepIndex: 1, type: 'down', result: true },
      { stepIndex: 0, type: 'down', result: true }
    ]
  }, {
    upResults: [false, false],
    expected: [
      { stepIndex: 0, type: 'up', result: false },
      { stepIndex: 0, type: 'down', result: true }]
  }]

  for (let itr of iterations) {
    // console.log({ itr })
    let S1 = new Step(up, down, 'S1', { up: { rval: itr.upResults[0] }, down: { rval: true } })
    let S2 = new Step(up, down, 'S2', { up: { rval: itr.upResults[1] }, down: { rval: true } })

    let L = new Chain()

    console.log({ L })

    L.add(S1)
    L.add(S2)
    it(`... ${JSON.stringify(itr.upResults)}`, done => {
      L.run()
        .then((data) => {
          console.group()
          console.log(data)
          console.groupEnd()
          expect(data).to.deep.equal(itr.expected)
          done()
        })
        .catch((e) => {
          done(e)
        })
    })
  }
})
