// * Bootstrap
const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
)
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

// * Form
const submitButton = document.querySelector('#submit-button')
submitButton.onclick = buildChart

const clearButton = document.querySelector('#clear-button')
clearButton.onclick = clearInputData

function setPlaceholdersForVariant(variant) {
    const form = document.querySelector('#labDataForm')

    for (variantDataKey in variant) {
        const input = form.querySelector(`input[name=${variantDataKey}]`)
        if (input) {
            input.placeholder = variant[variantDataKey]
        }
    }
}

function clearInputData() {
    const formInputs = document.querySelectorAll('#labDataForm input')

    formInputs.forEach((formInput) => {
        formInput.value = ''
    })
}

// * Chart

let getChartData = () => {
    return [[], [0, 1]]
}

function buildChart(chartTitle, xText, yText, chartType = 'spline') {
    let [chartData, categories] = getChartData()

    // console.log(chartData)
    // chartData = chartData[0]
    // console.log(chartData)

    console.log(chartData[0])

    let series = []

    if (typeof chartData[0] === 'object') {
        console.log('multiple charts')

        chartData.forEach((data) => {
            series.push({ data: data })
        })
    } else {
        series.push({ data: chartData })
    }

    const chart = Highcharts.chart('chart_1', {
        chart: {
            type: chartType,
        },
        title: {
            text: chartTitle,
        },
        xAxis: {
            title: {
                text: xText,
            },
            categories: categories,
        },
        yAxis: {
            title: {
                text: yText,
            },
        },

        legend: { enabled: false },

        plotOptions: {
            series: {
                animation: {
                    duration: 1000,
                },
            },
        },

        series: series,

        // series: [
        //     {
        //         data: chartData,
        //     },
        // ],
    })
}

function buildOneChart(chartData, categories) {
    const chart = Highcharts.chart('chart_1', {
        chart: {
            type: chartType,
        },
        title: {
            text: chartTitle,
        },
        xAxis: {
            title: {
                text: xText,
            },
            categories: categories,
        },
        yAxis: {
            title: {
                text: yText,
            },
        },

        legend: { enabled: false },

        plotOptions: {
            series: {
                animation: {
                    duration: 1000,
                },
            },
        },

        series: [
            {
                data: chartData,
            },
        ],
    })
}

function buildMultipleCharts(chartData, categories) {
    const chart = Highcharts.chart('chart_1', {
        chart: {
            type: chartType,
        },
        title: {
            text: chartTitle,
        },
        xAxis: {
            title: {
                text: xText,
            },
            categories: categories,
        },
        yAxis: {
            title: {
                text: yText,
            },
        },

        legend: { enabled: false },

        plotOptions: {
            series: {
                animation: {
                    duration: 1000,
                },
            },
        },

        series: [
            {
                data: chartData,
            },
        ],
    })
}
