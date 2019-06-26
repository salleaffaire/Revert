/**
 * Revert.
 *
 * Revert controls a series of steps called a chain. Each step must complete successfully for the chain to succeed.
 * If one fails, the whole chain is undone.
 *
 * @author Luc Martel.
 */

module.exports = {
  Step,
  Chain
}

let states = {
  ok: 0,
  error: 1
}

function Step (upPromise, downPromise, name) {
  // Transitions
  this.upPromise = upPromise
  this.downPromise = downPromise
  this.name = name

  // Were the functions called
  this.upped = false

  // State
  this.state = states.ok
  this.continue = true
}

function Chain () {
  // Steps array
  this.stack = []
  this.steps = []
  this.currentStepIndex = 0
}

Chain.prototype.add = function (step) {
  this.steps.push(step)
}

Chain.prototype.push = function (stepIndex, type, result) {
  this.stack.push({
    stepIndex,
    type,
    result
  })
}

Chain.prototype.up = async function () {
  const numSteps = this.steps.length

  let mustExit = false
  while ((this.currentStepIndex < numSteps) && (!mustExit)) {
    console.log(this.currentStepIndex)
    const currentStep = this.steps[this.currentStepIndex]
    const result = await currentStep.upPromise()
    const name = currentStep.name
    if (result) {
      // Promise was resolved, we continue
      this.push(this.currentStepIndex, 'up', true)
      this.currentStepIndex++
    } else {
      // Promise was rejected, we need to unwind
      mustExit = true
      this.push(this.currentStepIndex, 'up', false)
      if (name) {
        console.log(`Step ${name} failed`)
      }
    }
  }
  return {
    asFailed: mustExit
  }
}

Chain.prototype.down = async function () {
  while (this.currentStepIndex >= 0) {
    const currentStep = this.steps[this.currentStepIndex]
    await currentStep.downPromise()
    this.push(this.currentStepIndex, 'down', true)
    this.currentStepIndex--
  }
}

Chain.prototype.run = async function () {
  const { asFailed } = await this.up()

  // If we didn't get to the end of the chain
  if (asFailed) {
    await this.down()
  }
  return this.stack
}
