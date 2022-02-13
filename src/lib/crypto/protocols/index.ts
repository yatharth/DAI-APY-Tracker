import {aaveApyForBlock} from './aave'
import {compoundApyForBlock} from './compound'
import {Protocol} from '../../../schema'

export const protocols: {
    key: Protocol,
    apyForBlock: (blockNumber: number) => Promise<number>
}[] = [
    {
        key: 'aave',
        apyForBlock: aaveApyForBlock,
    }, {
        key: 'compound',
        apyForBlock: compoundApyForBlock,
    }
]
