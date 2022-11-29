submitButton.onclick = () => {
    const chartElement = document.querySelector('#chart_1')
    chartElement.dataset.built = true
    buildChart(
        'Зависимость максимальной перегрузки от начальной скорости движения шахтной клети',
        'Начальная скорость',
        'Максимальная перегрузка'
    )
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
buildChart(
    'Зависимость максимальной перегрузки от начальной скорости движения шахтной клети',
    'Начальная скорость',
    'Максимальная перегрузка'
)

// * Lab
getChartData = () => {
    let inputData = Object.assign({}, myVariant)

    const func = (x, k, g = 9.8) => {
        return (k * x) / g
    }

    let k = inputData.kStart
    k = 4

    startSpeedArguments = [10, 7.5, 5, 2.5]

    model = []
    modelArguments = []

    startSpeedArguments.forEach((startSpeed) => {
        modelArguments.push(startSpeed)
        model.push(func(startSpeed, k))
    })

    return [model, modelArguments]
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

        // ! for 6th lecture
        // P = k * x2

        return [cage, cargo /* , P */]
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

    return [modelArguments, model[1], model[3], model[4]]
}

function EulerMethod(n, h, x1_0, x2_0, y1_0, y2_0, func) {
    let x1 = [x1_0]
    let x2 = [x2_0]

    let y1 = [y1_0]
    let y2 = [y2_0]

    // let Ps = []

    for (let i = 0; i < n; i++) {
        let x1_prev = x1[x1.length - 1]
        let x2_prev = x2[x2.length - 1]

        let y1_prev = y1[y1.length - 1]
        let y2_prev = y2[y2.length - 1]

        x1.push(x1_prev + h * x2_prev)
        y1.push(y1_prev + h * y2_prev)

        let [cage, cargo /* , P */] = func(x1_prev, x2_prev, y1_prev, y2_prev)

        x2.push(x2_prev + h * cage)
        y2.push(y2_prev + h * cargo)
        // Ps.push(P)
    }

    return [x1, x2, y1, y2]
}
