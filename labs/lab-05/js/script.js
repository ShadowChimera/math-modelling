submitButton.onclick = () => {
  const chartElement = document.querySelector('#chart_1')
  chartElement.dataset.built = true
  buildChart('Моделирование интенсивности гамма-излучения', 'Время', '')
}

const myVariant = {
  muStart: 0.1,
  muStop: 2.5,
  muStep: 0.05,

  roStart: 1.2,
  roStop: 6,
  roStep: 0.1,

  dStart: 1.5,
  dStop: 6.3,
  dStep: 0.1,

  NStart: 15000,
  NStop: 63000,
  NStep: 1000,
}

setPlaceholdersForVariant(myVariant)
buildChart('Моделирование интенсивности гамма-излучения', 'Время', '')

// * Lab
getChartData = () => {
  let inputData = getFormData(myVariant)

  const model = []
  const modelArguments = []

  const iterationArgsKeys = ['mu', 'ro', 'd', 'N']
  let iterationArgs = {}

  iterationArgsKeys.forEach((key) => {
    iterationArgs[key] = inputData[`${key}Start`]
  })

  const condition = (key, value) => {
    return value <= inputData[`${key}Stop`] + 1e-6
  }

  let forcedStopIterationBorder = 1000

  for (let iteration = 0; iteration < forcedStopIterationBorder; iteration++) {
    if (!condition(iterationArgsKeys[0], iterationArgs[iterationArgsKeys[0]])) {
      break
    }

    model.push(
      buger(
        iterationArgs.N,
        iterationArgs.mu,
        iterationArgs.ro,
        iterationArgs.d
      )
    )

    modelArguments.push(iterationArgs.N)

    iterationArgsKeys.forEach((key) => {
      iterationArgs[key] += inputData[`${key}Step`]
    })
  }

  console.log(model)

  return [model, modelArguments]
}

function buger(N0, mu, ro, d) {
  return N0 * Math.exp(-mu * ro * d)
}
