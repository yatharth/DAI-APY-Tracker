import {forEach} from 'p-iteration'

import {ETHEREUM_AVG_BLOCKTIME_SECONDS, numBlocksSince} from '../lib/crypto/ethereum'
import {getLastBlockNumber, insertRate} from '../lib/db/index'
import {fetchRates, fetchRatesSince} from '../lib/crypto/fetch-rates'
import {fakeRates} from '../lib/crypto/fake-rates'


export async function insertFakeRates(numBlocks: number) {
    const rates = await fakeRates(numBlocks)
    await forEach(rates, insertRate)
}

export async function insertSomeRates(numBlocks: number) {
    await fetchRates(numBlocks, insertRate)
}

export async function insertNewRates() {
    const lastBlockNumberInDb = await getLastBlockNumber()
    await fetchRatesSince(lastBlockNumberInDb, insertRate)
}

export function startWorker() {

    // Since we can pull half an hour’s worth of data at a time, and the cache only refreshes every 10 minutes or so,
    //  we only afford to pull less often than this if we wanted to, while offering reasonably fresh data on client load,
    //  that catches up to real-time ASAP.
    setInterval(insertNewRates, 2 * ETHEREUM_AVG_BLOCKTIME_SECONDS * 1000)

}
