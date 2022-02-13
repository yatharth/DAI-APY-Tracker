import {map} from 'p-iteration'
import {getRecentBlocks} from './ethereum'
import {protocols} from './protocols'
import {flatten} from '../misc/iteration'
import {Row} from '../schema'


function fakeApy(): number {
    return Math.random() * 1.5 + 1
}

export async function fakeRates(numBlocks: number): Promise<Row[]> {

    const blocks = await getRecentBlocks(numBlocks)

    return flatten(await map(blocks, async block =>
        await map(protocols, async protocol => ({
            timestamp: block.timestamp,
            protocol: protocol.key,
            blockNumber: block.number,
            apy: fakeApy(),
        })),
    ))

}