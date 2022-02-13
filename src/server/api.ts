import {Request, Response, NextFunction} from 'express'

import * as cache from '../lib/cache'
import * as db from '../lib/db'


export async function recent(req: Request, res: Response, next: NextFunction) {

    const cacheKey = 'recent'
    const cacheDuration = 10 * 60  // Ten minutes.

    const timeframe = '30 days'

    try {
        const data = await cache.getOrSave(cacheKey, cacheDuration, async () => await db.getRecent(timeframe))
        res.json(data)
    } catch (err) {
        next(err)
    }

}


export async function historical(req: Request, res: Response, next: NextFunction) {

    const cacheKey = 'historical'
    const cacheDuration = 1 * 60 * 60  // One hour.

    const timeframe = '5 years'
    const resolution = '5 minutes'

    try {
        const data = await cache.getOrSave(cacheKey, cacheDuration, async () => await db.getHistorical(timeframe, resolution))
        res.json(data)
    } catch (err) {
        next(err)
    }

}
