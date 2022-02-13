import {aaveApyForBlock} from './aave'
import {compoundApyForBlock} from './compound'
import {Protocol} from '../../schema'

export const protocols = [
    {
        key: 'aave' as Protocol,
        name: "Aave Lending Pool",
        apyForBlock: aaveApyForBlock,
    }, {
        key: 'compound' as Protocol,
        name: "Compound Finance",
        apyForBlock: compoundApyForBlock,
    }
]
