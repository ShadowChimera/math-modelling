submitButton.onclick = () => {
  const chartElement = document.querySelector('#chart_1')
  chartElement.dataset.built = true
  buildChart('Модель колебательного контура', 'Время', '')
}

const myVariant = {
  q1Start: 6,
  q: 2,

  LStart: 2600,
  LStop: 3300,
  LStep: 350,

  RStart: 3400,
  RStop: 4200,
  RStep: 400,

  CStart: 2700,
  CStop: 3500,
  CStep: 400,

  tStart: 0,
  tStop: 5,
  tStep: 0.0005,

  E: 1100,
}

setPlaceholdersForVariant(myVariant)
buildChart('Модель колебательного контура', 'Время', '')

// * Lab
getChartData = () => {
  const formData = new FormData(document.querySelector('#labDataForm'))

  let inputData = Object.assign({}, myVariant)

  for (inputDataKey in inputData) {
    if ((formData.get(inputDataKey) ?? '') !== '') {
      inputData[inputDataKey] = formData.get(inputDataKey)
    }

    inputData[inputDataKey] = Number(inputData[inputDataKey])
  }

  const models = []
  const modelsArguments = []

  let forcedStopIterationBorder = 1000
  let iteration = 0
  for (
    let L = inputData.LStart, R = inputData.RStart, C = inputData.CStart;
    L <= inputData.LStop + 1e-6;
    L += inputData.LStep, R += inputData.RStep, C += inputData.CStep
  ) {
    const [modelArguments, model] = modelEquation(
      inputData.q,
      inputData.q1Start,
      L,
      R,
      C,
      inputData.E,
      inputData.tStart,
      inputData.tStop,
      inputData.tStep
    )

    models.push(model)
    modelsArguments.push(modelArguments)

    if (++iteration >= forcedStopIterationBorder) {
      console.log('Forced Loop Stopping')
      break
    }
  }

  return [models, modelsArguments[0]]
}

function modelEquation(q, q1, L, R, C, E, tStart, tStop, tStep) {
  console.log(L)

  let LDefault = L,
    RDefault = R,
    CDefault = C,
    EDefault = E

  let func = (
    q1,
    q2,
    C = CDefault,
    R = RDefault,
    L = LDefault,
    E = EDefault
  ) => {
    // return (-C * q2 - R * q1 + E) / L
    return (E - q1 / C - R * q2) / L
  }

  const eulerMethodIterationCount = (tStop - tStart) / tStep

  const model = EulerMethod(eulerMethodIterationCount, tStep, q, q1, func)

  let modelArguments = []
  for (let i = 0; i < model[1].length; i++) {
    modelArguments.push(Number((tStep * i + tStart).toFixed(4)))
  }

  return [modelArguments, model[1]]
}

function EulerMethod(n, h, x1_0, x2_0, func) {
  // ? x1_i+1 = x1_i + h * x2_i
  // ? x2_i+1 = x2_i + h * (-k * x2_i - c * x1_i + P) / m

  let x1 = [x1_0]
  let x2 = [x2_0]

  for (let i = 0; i < n; i++) {
    let x1_prev = x1[x1.length - 1]
    let x2_prev = x2[x2.length - 1]

    x1.push(x1_prev + h * x2_prev)
    x2.push(x2_prev + h * func(x1_prev, x2_prev))
  }

  return [x1, x2]
}
