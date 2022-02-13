import {BigNumber, ethers} from 'ethers'

import {etherProvider} from '../ethereum'


const DAI_TOKEN_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

// For AAVE Lending Pool V2.
const CONTRACT_ADDRESS = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"
const ABI = require('@aave/protocol-v2/artifacts/contracts/protocol/lendingpool/LendingPool.sol/LendingPool.json').abi
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, etherProvider)


function calculateApy(currentLiquidityRate: BigNumber): number {
    const ray = 1e27
    // @ts-ignore
    return 100 * (currentLiquidityRate / ray)
}

export async function aaveApyForBlock(blockNumber: number) {
    let currentLiquidityRate = (await contract.getReserveData(DAI_TOKEN_ADDRESS, {blockTag: blockNumber})).currentLiquidityRate as BigNumber
    return calculateApy(currentLiquidityRate)
}
