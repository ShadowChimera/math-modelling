submitButton.onclick = () => {
    const chartElement = document.querySelector('#chart_1')
    chartElement.dataset.built = true
    buildChart('Модель физического процесса', 'Время', '')
}

const myVariant = {
    x1Start: 18,
    x: 2,

    mStart: 1100,
    mStop: 1900,
    mStep: 400,

    cStart: 20000,
    cStop: 30000,
    cStep: 5000,

    kStart: 3400,
    kStop: 4000,
    kStep: 300,

    tStart: 0,
    tStop: 5,
    tStep: 0.0005,
}

setPlaceholdersForVariant(myVariant)
buildChart('Модель физического процесса', 'Время', '')

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
        const [modelArguments, model] = modelEquation(
            inputData.x,
            inputData.x1Start,
            m,
            c,
            k,
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

function modelEquation(x, x1, m, c, k, tStart, tStop, tStep) {
    let mDefault = m,
        cDefault = c,
        kDefault = k

    let func = (x1, x2, k = kDefault, c = cDefault, m = mDefault) => {
        const P = 0

        return (-k * x2 - c * x1 + P) / m
    }

    const eulerMethodIterationCount = (tStop - tStart) / tStep

    const model = EulerMethod(eulerMethodIterationCount, tStep, x, x1, func)

    // let modelResults = []
    let modelArguments = []
    for (let i = 0; i < model[1].length; i++) {
        // modelResults.push(m * model[1][i] + k * model[0][i] + c * x)
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

function degToRad(deg) {
    return deg * (Math.PI / 180.0)
}
