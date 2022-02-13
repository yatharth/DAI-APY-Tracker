export const protocolNames: { [protocol in Protocol]: string } = {
    'aave': "Aave Lending Pool",
    'compound': "Compound Finance",
}

export const protocols = Object.keys(protocolNames) as Protocol[]


export type Protocol = 'aave' | 'compound'

export type Row = {
    timestamp: number,
    protocol: Protocol,
    blockNumber: number,
    apy: number,
}
