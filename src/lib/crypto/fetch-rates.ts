import {map} from 'p-iteration'

import {flatten, range} from '../misc/iteration'
import {etherProvider, numBlocksSince} from './ethereum'
import {protocols} from './protocols/index'
import {Row} from '../schema'


// With more than this, we sometimes have issues with the RPC provider.
// However, this many is enough to give about half an hour’s worth of data,
//  given the current average Ethereum block time of every 15 seconds.
const maxBlocksToFetch: number = 120

export async function fetchRates(numBlocksToFetch: number = maxBlocksToFetch): Promise<Row[]> {

    const latestBlockNumber = await etherProvider.getBlockNumber()

    if (numBlocksToFetch > maxBlocksToFetch) {
        console.log(`Only fetching the max of ${maxBlocksToFetch} blocks instead of ${numBlocksToFetch} blocks.`)
        numBlocksToFetch = maxBlocksToFetch
    }

    return flatten(await map(range(numBlocksToFetch), async i => {

        const blockNumber = latestBlockNumber - i
        const block = await etherProvider.getBlock(blockNumber)

        return await map(protocols, async protocol => ({
            timestamp: block.timestamp,
            protocol: protocol.key,
            blockNumber: blockNumber,
            apy: await protocol.apyForBlock(blockNumber),
        }))
    }))

}

export async function fetchRatesSince(blockNumber?: number) {
    if (!blockNumber)
        return await fetchRates()
    else
        return await fetchRates(await numBlocksSince(blockNumber))
}






