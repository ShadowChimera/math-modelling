submitButton.onclick = () => {
    const chartElement = document.querySelector('#chart_1')
    chartElement.dataset.built = true
    buildChart('Модель колебательного контура', 'Время', 'X(t)')
}

const myVariant = {
    a: 0.6,
    c1: 1.5,
    c2: 3,

    tStart: 0.1,
    tStop: 2,
    tStep: 0.1,

    fStart: 10,
    fStop: 50,
    fStep: 5,
}

setPlaceholdersForVariant(myVariant)
buildChart('Модель колебательного контура', 'Время', 'X(t)')

// * Lab
getChartData = () => {
    const formData = new FormData(document.querySelector('#labDataForm'))

    let inputData = {
        a: null,
        c1: null,
        c2: null,

        tStart: null,
        tStop: null,
        tStep: null,

        fStart: null,
        fStop: null,
        fStep: null,
    }

    for (inputDataKey in inputData) {
        inputData[inputDataKey] =
            formData.get(inputDataKey) ?? myVariant[inputDataKey]

        if (inputData[inputDataKey] === '') {
            inputData[inputDataKey] = myVariant[inputDataKey]
        }

        inputData[inputDataKey] = Number(inputData[inputDataKey])
    }

    const ocModel = []
    const ocModelArguments = []

    let forcedStopIterationBorder = 1000
    let iteration = 0
    for (
        let t = inputData.tStart, f = inputData.fStart;
        t <= inputData.tStop + 1e-6;
        t += inputData.tStep, f += inputData.fStep
    ) {
        ocModelArguments.push(t.toFixed(1))
        ocModel.push(
            Number(
                ocEquation(
                    t,
                    f,
                    inputData.a,
                    inputData.c1,
                    inputData.c2
                ).toFixed(3)
            )
        )

        if (++iteration >= forcedStopIterationBorder) {
            console.log('Forced Loop Stopping')
            break
        }
    }

    return [ocModel, ocModelArguments]
}

function degToRad(deg) {
    return deg * (Math.PI / 180.0)
}

function ocEquation(t, f, a, c1, c2) {
    return (
        Math.exp(-a * t) *
        (c1 * Math.cos(degToRad(circularFrequency(f) * t)) +
            c2 * Math.sin(degToRad(circularFrequency(f) * t)))
    )
}

function circularFrequency(f) {
    return 2 * Math.PI * f
}
