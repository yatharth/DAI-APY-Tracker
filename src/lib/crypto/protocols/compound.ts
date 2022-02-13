import {BigNumber, ethers} from 'ethers'

import {etherProvider} from '../ethereum'


// For Compound Finance cDAI token.
const ABI = require('./abi/compound_cdai_token.json')
const CONTRACT_ADDRESS = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643"
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, etherProvider)


function calculateApy(supplyRatePerBlock: BigNumber) {

    const ethMantissa = 1e18
    const blocksPerDay = 4 * 60 * 24
    const daysPerYear = 365

    // @ts-ignore
    return 100 * ((((1 + supplyRatePerBlock / ethMantissa * blocksPerDay) ** daysPerYear)) - 1)

}

export async function compoundApyForBlock(blockNumber: number) {
    const supplyRatePerBlock = (await contract.supplyRatePerBlock({blockTag: blockNumber})) as BigNumber
    return calculateApy(supplyRatePerBlock)
}
