import Redis from 'ioredis'

type RedisDBs = {
    ephemeral: Redis
    persistent: Redis
}

declare global {
    var redis: RedisDBs | undefined
}

let redis: RedisDBs

if (process.env.NODE_ENV === 'production') {
    redis = {
        ephemeral: new Redis('redis://localhost:6379'),
        persistent: new Redis('redis://localhost:6380')
    }
} else {
    if (!global.redis) {
        global.redis = {
            ephemeral: new Redis('redis://localhost:6379'),
            persistent: new Redis('redis://localhost:6380')
        }
    }
    redis = global.redis
}

export default redis
