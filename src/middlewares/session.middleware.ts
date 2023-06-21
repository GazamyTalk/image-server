import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import { sessionStoreConfig } from "../config/session";

declare module 'express-session' {
    interface SessionData {
        username: string
    }
}

const createSessionMiddleware = () => {

    let redisClient = createClient({ url: sessionStoreConfig.url });
    redisClient.connect().catch(console.error)

    let redisStore = new RedisStore({
    client: redisClient,
    prefix: "gazamytalk:",
    })

    return session({
        secret: sessionStoreConfig.secret,
        name: 'sessionid',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 3600 * 1000,
            sameSite: 'none'
        },
        store: redisStore
    })
}

export default createSessionMiddleware;