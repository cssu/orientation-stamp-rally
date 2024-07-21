import Redis from 'ioredis'

type RedisDBs = {
    ephemeral: Redis
    persistent: Redis
}

declare global {
    var redis: RedisDBs | undefined
}

let redis: RedisDBs

const ephemeral_url =
    process.env.NODE_ENV === 'production'
        ? 'redis://redis_ephemeral:6379'
        : 'redis://localhost:6379'
const persistent_url =
    process.env.NODE_ENV === 'production'
        ? 'redis://redis_persistent:6379'
        : 'redis://localhost:6380'

if (process.env.NODE_ENV === 'production') {
    redis = {
        ephemeral: new Redis(ephemeral_url),
        persistent: new Redis(persistent_url)
    }
} else {
    if (!global.redis) {
        global.redis = {
            ephemeral: new Redis(ephemeral_url),
            persistent: new Redis(persistent_url)
        }
    }
    redis = global.redis
}

export default redis
