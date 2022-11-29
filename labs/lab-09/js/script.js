submitButton.onclick = () => {
    const chartElement = document.querySelector('#chart_1')
    chartElement.dataset.built = true
    buildChart('Модель интенсивности рассеянного гамма-излучения', 'h', 'N')
}

const myVariant = {
    dStart: 2.2,
    dStop: 10.2,
    dStep: 0.2,

    alphaStart: 2,
    alphaStop: 145,
    alphaStep: 5,

    RStart: 2,
    RStop: 22,
    RStep: 0.5,

    hStart: 0,
    hStop: 10,
    hStep: 0.25,

    Q: 5,
    A: 1,
}

setPlaceholdersForVariant(myVariant)
buildChart('Модель интенсивности рассеянного гамма-излучения', 'h', 'N')

// * Lab
getChartData = () => {
    let inputData = getFormData(myVariant)

    const model = []
    const modelArguments = []

    const iterationArgsKeys = ['h', 'd', 'R', 'alpha']
    let iterationArgs = {}

    iterationArgsKeys.forEach((key) => {
        iterationArgs[key] = inputData[`${key}Start`]
    })

    const condition = (key, value) => {
        return value <= inputData[`${key}Stop`] + 1e-6
    }

    let forcedStopIterationBorder = 1000

    for (
        let iteration = 0;
        iteration < forcedStopIterationBorder;
        iteration++
    ) {
        if (
            !condition(
                iterationArgsKeys[0],
                iterationArgs[iterationArgsKeys[0]]
            )
        ) {
            break
        }

        model.push(
            modelEquation(
                iterationArgs.h + 1.5,
                // iterationArgs.d,
                // iterationArgs.alpha,
                // iterationArgs.R,
                // inputData.hStart,
                inputData.dStart,
                inputData.alphaStart,
                inputData.RStart,
                inputData.Q,
                inputData.A
            )
        )

        modelArguments.push(iterationArgs.h)

        iterationArgsKeys.forEach((key) => {
            iterationArgs[key] += inputData[`${key}Step`]
        })
    }

    console.log(model)

    return [model, modelArguments]
}

function modelEquation(h, d, alpha, R, Q, A) {
    alpha = degToRad(alpha)

    B = b_func(A, Q, d, alpha)

    N =
        (B * h * Math.pow(Math.cos(alpha), 3)) /
        Math.pow(
            Math.pow(R, 2) * Math.pow(Math.cos(alpha), 2) -
                R * h * Math.sin(2 * alpha) +
                Math.pow(h, 2),
            3 / 2
        )

    return N
}

function b_func(A, Q, d, alpha) {
    return ((A * Q * Math.pow(d, 2)) / 64) * Math.pow(Math.tan(alpha / 2), 2)
}

function degToRad(deg) {
    return deg * (Math.PI / 180.0)
}

// function modelEquation(mu, ro, d, N, mu2) {
//     N_b = buger(N, mu, ro, d)

//     q = (1 / (mu - mu2)) * ((1 / (ro * d)) * Math.log(N / N_b)) - mu2

//     return q
// }

// function buger(N0, mu, ro, d) {
//     return N0 * Math.exp(-mu * ro * d)
// }
