import {map} from 'p-iteration'

import {flatten, range} from '../misc/iteration'
import {etherProvider, numBlocksSince} from './ethereum'
import {protocols} from './protocols/index'
import {Row} from '../../schema'


// With more than this, we sometimes have issues with the RPC provider.
// However, this many is enough to give about half an hour’s worth of data,
//  given the current average Ethereum block time of every 15 seconds.
const maxBlocksToFetch: number = 120

type Callback = (rate: Row) => unknown

export async function fetchRates(numBlocksToFetch?: number, callback?: Callback): Promise<Row[]> {

    if (!numBlocksToFetch) numBlocksToFetch = maxBlocksToFetch

    const latestBlockNumber = await etherProvider.getBlockNumber()

    if (numBlocksToFetch > maxBlocksToFetch) {
        console.log(`Only fetching the max of ${maxBlocksToFetch} blocks instead of ${numBlocksToFetch} blocks.`)
        numBlocksToFetch = maxBlocksToFetch
    }

    return flatten(await map(range(numBlocksToFetch), async i => {

        const blockNumber = latestBlockNumber - i
        const block = await etherProvider.getBlock(blockNumber)

        return await map(protocols, async protocol => {
            const row = {
                timestamp: block.timestamp,
                protocol: protocol.key,
                blockNumber: blockNumber,
                apy: await protocol.apyForBlock(blockNumber),
            }
            if (callback) callback(row)
            return row
        })

    }))

}

export async function fetchRatesSince(blockNumber?: number, callback?: Callback) {
    if (!blockNumber)
        return await fetchRates(undefined, callback)
    else
        return await fetchRates(await numBlocksSince(blockNumber), callback)
}






