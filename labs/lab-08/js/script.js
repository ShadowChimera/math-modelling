submitButton.onclick = () => {
    const chartElement = document.querySelector('#chart_1')
    chartElement.dataset.built = true
    buildChart('Модель содержания полезного компонента', 'Время', '')
}

const myVariant = {
    muStart: 0.12,
    muStop: 2.5,
    muStep: 0.05,

    roStart: 1.2,
    roStop: 6,
    roStep: 0.1,

    dStart: 1.5,
    dStop: 6.3,
    dStep: 0.1,

    N0: 25000,
    mu2: 0.12,
}

setPlaceholdersForVariant(myVariant)
buildChart('Модель содержания полезного компонента', 'Время', '')

// * Lab
getChartData = () => {
    let inputData = getFormData(myVariant)

    const model = []
    const modelArguments = []

    const iterationArgsKeys = ['mu', 'ro', 'd']
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
                iterationArgs.mu,
                iterationArgs.ro,
                iterationArgs.d,
                inputData.N0,
                inputData.mu2
            )
        )

        modelArguments.push(iteration)

        iterationArgsKeys.forEach((key) => {
            iterationArgs[key] += inputData[`${key}Step`]
        })
    }

    console.log(model)

    return [model, modelArguments]
}

function modelEquation(mu, ro, d, N, mu2) {
    N_b = buger(N, mu, ro, d)

    q = (1 / (mu - mu2)) * ((1 / (ro * d)) * Math.log(N / N_b)) - mu2

    return q
}

function buger(N0, mu, ro, d) {
    return N0 * Math.exp(-mu * ro * d)
}
