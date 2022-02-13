export type Protocol = 'aave' | 'compound'

export type Row = {
    timestamp: number,
    protocol: Protocol,
    blockNumber: number,
    apy: number,
}
