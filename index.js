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

function Step(upPromise, downPromise, name) {
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

function Chain() {
  // Steps array
  this.steps = []
  this.currentStepIndex = 0

}

Chain.prototype.add = function (step) {
  this.steps.push(step)
}

Chain.prototype.up = async function () {
  const numSteps = this.steps.length
  console.log(`Excuting ${numSteps} chain`)

  let mustExit = false
  while ((this.currentStepIndex < numSteps) && (!mustExit)) {
    console.log(this.currentStepIndex)
    const currentStep = this.steps[this.currentStepIndex]
    const result = await currentStep.upPromise()
    const name = currentStep.name
    if (result) {
      // Promise was resolved, we continue
    }
    else {
      // Promise was rejected, we need to unwind
      mustExit = true
      if (name) {
        console.log(`Step ${name} failed`)
      }
    }
    this.currentStepIndex++
  }
  return {
    lastStep: this.currentStep
  }
}

Chain.prototype.run = async function () {

  const { lastStep } = await this.up()

}