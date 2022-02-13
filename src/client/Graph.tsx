import React from 'react'
import Chart from "react-apexcharts"
import {ApexOptions} from 'apexcharts'

import {useData} from './hooks/useData'
import {protocolNames} from '../schema'


const apyFormatter = (digits: number) => (apy) => {
    return `${apy.toFixed(digits)}%`
}

const chartOptions: ApexOptions = {
    chart: {
        type: 'line',
        height: 350,
        zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true,
        },
        toolbar: {
            autoSelected: 'zoom',
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 5,
    },
    markers: {
        size: 0,
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.7,
            opacityTo: 0.5,
            stops: [0, 90, 100],
        },
    },
    yaxis: {
        labels: {
            formatter: apyFormatter(2),
        },
        title: {
            text: 'APY',
        },
    },
    xaxis: {
        type: 'datetime',
        title: {
            text: 'Time',
        },
    },
    tooltip: {
        shared: false,
        y: {
            formatter: apyFormatter(3),
        },
    },
}

export const Graph = () => {

    const [data, didLoadHistorical, loadHistorical] = useData()

    const chartSeries = Object.keys(data).map(protocol => ({
        name: protocolNames[protocol],
        data: Object.keys(data[protocol]).map(timestamp => ({
            x: (timestamp as unknown as number) * 1000,  // Convert to milliseconds as convention in Javascript.
            y: data[protocol][timestamp],
        })),
    }))

    return (
        <>
            <button onClick={loadHistorical} disabled={didLoadHistorical}>
                {didLoadHistorical ? "Loaded historical data!" : "Load historical data"}
            </button>

            <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                width="500"
            />
        </>
    )
}
