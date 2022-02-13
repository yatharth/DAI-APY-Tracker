// Javascript represent timestamps in milliseconds since Unix epoch, where traditionally, they’re in seconds.
export const dateFromTimestamp = (timestamp: number) => new Date(timestamp * 1000)
export const timestampFromDate = (date: Date) => Math.floor(date.getTime() / 1000)