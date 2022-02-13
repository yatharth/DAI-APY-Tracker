import {Client} from 'pg'

import {Protocol, Row} from '../schema'


const dbClient = new Client({
    host: process.env['ROOT_DIR'] ? 'postgres' : 'localhost',
    port: 5432,
    user: 'pguser',
    password: 'password',
    database: 'app',
})

dbClient.connect()


// Insert an observed rate. This operation is idempotent! Feel free to call multiple times.
export async function insertRate(record: Row) {
    const query = `
        INSERT INTO rates(timestamp, protocol, "blockNumber", apy)
        VALUES (to_timestamp($1), $2, $3, $4)
    `
    const values = [record.timestamp, record.protocol, record.blockNumber, record.apy]
    await dbClient.query(query, values)
}

export async function getLastBlockNumber(): Promise<number|undefined> {
    const query = `
        SELECT "blockNumber" 
        FROM rates
        ORDER BY timestamp DESC
        LIMIT 1
    `
    const result = await dbClient.query(query)
    const rows = result.rows as Row[]

    if (rows.length == 0) return
    return rows[0].blockNumber
}

// Get recent rates within a certain timeframe.
export async function getRecent(timeframe: string = '30 days'): Promise<Row[]> {
    const query = `
        SELECT date_part('epoch', timestamp) as timestamp, protocol, "blockNumber", apy 
        FROM rates
        WHERE timestamp > now() - INTERVAL '${timeframe}'
    `
    const result = await dbClient.query(query)
    return result.rows as Row[]
}

// Get recent rates, at a specific resolution. This allows you to transfer less data.
export async function getHistorical(timeframe: string = '5 years', resolution: string = '5 minutes')
    : Promise<Row[]> {

    const query = `
        SELECT date_part('epoch', time_bucket('${resolution}', timestamp)) as "bucket", protocol, max("blockNumber") as "blockNumber", avg(apy)
        FROM rates
        WHERE timestamp > now() - INTERVAL '${timeframe}'
        GROUP BY bucket, protocol
        ORDER BY bucket DESC
    `
    const result = await dbClient.query(query)
    const rows = result.rows as {bucket: number, protocol: Protocol, blockNumber: number, avg: number}[]
    return rows.map(row => ({timestamp: row.bucket, protocol: row.protocol, blockNumber: row.blockNumber, apy: row.avg}))
}
