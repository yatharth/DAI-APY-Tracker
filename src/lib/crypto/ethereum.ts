import {ethers} from 'ethers'
import {map} from 'p-iteration'

import {range} from '../misc/iteration'


const RPC_ENDPOINT = "https://eth.coincircle.com"
export const ETHEREUM_AVG_BLOCKTIME_SECONDS = 15

export const etherProvider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT)

export async function getRecentBlocks(numBlocks: number) {
    const lastBlockNumber = await etherProvider.getBlockNumber()
    const blockNumbers = range(numBlocks).map(i => lastBlockNumber - i)
    const blocks = await map(blockNumbers, blockNumber => etherProvider.getBlock(blockNumber))
    return blocks
}

export async function numBlocksSince(blockNumber: number) {
    const latestBlockNumber = await etherProvider.getBlockNumber()
    return latestBlockNumber - blockNumber
}
