submitButton.onclick = () => {
  const chartElement = document.querySelector('#chart_1')
  chartElement.dataset.built = true
  buildChart('Модель физического процесса (Шахтная клеть)', 'Время', '')
}

const myVariant = {
  x1Start: 10,
  x: 0,
  y1Start: 10,
  y: 0.001,

  mStart: 2000,
  mStop: 3000,
  mStep: 500,

  cStart: 2000,
  cStop: 22000,
  cStep: 10000,

  kStart: 1000,
  kStop: 2000,
  kStep: 500,

  tStart: 0,
  tStop: 1,
  tStep: 0.0005,
}

setPlaceholdersForVariant(myVariant)
buildChart('Модель физического процесса (Шахтная клеть)', 'Время', '')

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
    let m = inputData.mStart, c = inputData.cStart, k = inputData.kStart;
    m <= inputData.mStop + 1e-6;
    m += inputData.mStep, c += inputData.cStep, k += inputData.kStep
  ) {
    const [modelArguments, model_1, model_2] = modelEquation(
      inputData.x,
      inputData.x1Start,
      inputData.y,
      inputData.y1Start,
      m,
      c,
      k,
      inputData.tStart,
      inputData.tStop,
      inputData.tStep
    )

    models.push(model_1)
    modelsArguments.push(modelArguments)

    if (++iteration >= forcedStopIterationBorder) {
      console.log('Forced Loop Stopping')
      break
    }
  }

  return [models, modelsArguments[0]]
}

function modelEquation(x, x1, y, y1, m, c, k, tStart, tStop, tStep) {
  let mDefault = m,
    cDefault = c,
    kDefault = k

  let func = (
    x1,
    x2,
    y1,
    y2,
    k = kDefault,
    c = cDefault,
    m = mDefault,
    g = 9.8
  ) => {
    let cage, cargo

    cage = -(g + (k * x2) / m - (c * (y1 - x1)) / m)
    cargo = -(g + (c * (y1 - x1)) / m)

    return [cage, cargo]
  }

  const eulerMethodIterationCount = (tStop - tStart) / tStep

  const model = EulerMethod(
    eulerMethodIterationCount,
    tStep,
    x,
    x1,
    y,
    y1,
    func
  )

  let modelArguments = []
  for (let i = 0; i < model[1].length; i++) {
    modelArguments.push(Number((tStep * i + tStart).toFixed(4)))
  }

  return [modelArguments, model[1], model[3]]
}

function EulerMethod(n, h, x1_0, x2_0, y1_0, y2_0, func) {
  let x1 = [x1_0]
  let x2 = [x2_0]

  let y1 = [y1_0]
  let y2 = [y2_0]

  for (let i = 0; i < n; i++) {
    let x1_prev = x1[x1.length - 1]
    let x2_prev = x2[x2.length - 1]

    let y1_prev = y1[y1.length - 1]
    let y2_prev = y2[y2.length - 1]

    x1.push(x1_prev + h * x2_prev)
    y1.push(y1_prev + h * y2_prev)

    let [cage, cargo] = func(x1_prev, x2_prev, y1_prev, y2_prev)

    x2.push(x2_prev + h * cage)
    y2.push(y2_prev + h * cargo)
  }

  return [x1, x2, y1, y2]
}
