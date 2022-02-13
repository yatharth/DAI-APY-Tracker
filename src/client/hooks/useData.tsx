import _ from 'lodash'
import {useState, useEffect} from 'react'

import {protocols, Row} from '../../schema'
import {useInterval, useTimeout} from './timeoutHooks'
import {ETHEREUM_AVG_BLOCKTIME_SECONDS} from '../../lib/crypto/ethereum'
import {fetchRatesSince} from '../../lib/crypto/fetch-rates'


function processApiData(apiData: Row[]): [unknown, number] {
    const newData = {}
    for (const protocol of protocols) {
        newData[protocol] = {}
    }
    for (const row of apiData) {
        newData[row.protocol][row.timestamp] = row.apy
    }
    const lastBlockNumber = apiData[apiData.length - 1].blockNumber
    return [newData, lastBlockNumber]
}


export function useData() {

    const [data, setData] = useState({})
    const [lastBlockNumber, setLastBlockNumber] = useState(0)

    async function handleNewData(apiData: Row[]) {
        const [newData, newLastBlockNumber] = processApiData(apiData)
        console.log(`Fetched rates from ${apiData.length / protocols.length} blocks ending with block ${newLastBlockNumber}.`)
        setLastBlockNumber(() => newLastBlockNumber)
        setData(oldData => _.merge(newData, oldData))
    }

    const fetchRatesFromApi = (endpoint: string) => {
        console.log(`Fetching data from endpoint /${endpoint}.`)
        return fetch(`http://localhost:3000/${endpoint}`).then(response => response.json())
            .then(apiData => handleNewData(apiData))
    }

    const fetchNewRatesFromChain = () => {
        console.log(`Fetching new rates from block ${lastBlockNumber}.`)
        return fetchRatesSince(lastBlockNumber)
            .then(apiData => handleNewData(apiData))
    }

    useEffect(() => {fetchRatesFromApi('recent')}, [])

    const refreshInterval = ETHEREUM_AVG_BLOCKTIME_SECONDS * 1000
    useInterval(() => fetchNewRatesFromChain(), refreshInterval)

    const [didLoadHistoricalData, setDidLoadHistoricalData] = useState(false)
    const loadHistoricalData = () =>
        fetchRatesFromApi('historical')
            .then(() => setDidLoadHistoricalData(true))

    return [data, didLoadHistoricalData, loadHistoricalData]
}

