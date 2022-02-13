import * as redis from 'redis';


const redisClient = redis.createClient({
    url: 'redis://redis:6379',
})

redisClient.connect().then(() => console.log("Connected to Redis."))

redisClient.on('error', err => {
    console.log(err)
})

export async function setEx(cacheKey: string, value: unknown, ttlSeconds: number = 60) {
    return await redisClient.setEx(cacheKey, ttlSeconds, JSON.stringify(value))
}

export async function get(key: string) {
    const jsonString = await redisClient.get(key)
    if (!jsonString) return
    return JSON.parse(jsonString)
}

export async function getOrSave(cacheKey: string, ttlSeconds: number, getter: () => Promise<unknown>) {
    let data = await get(cacheKey)
    if (!data) {
        console.log(`Cache miss for ${cacheKey}.`)
        data = await getter()
        await setEx(cacheKey, data, ttlSeconds)
    }
    return data
}
