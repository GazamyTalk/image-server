"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const redis_1 = require("redis");
const session_1 = require("../config/session");
const createSessionMiddleware = () => {
    let redisClient = (0, redis_1.createClient)({ url: session_1.sessionStoreConfig.url });
    redisClient.connect().catch(console.error);
    let redisStore = new connect_redis_1.default({
        client: redisClient,
        prefix: "gazamytalk:",
    });
    return (0, express_session_1.default)({
        secret: session_1.sessionStoreConfig.secret,
        name: 'sessionid',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 3600 * 100
        },
        store: redisStore
    });
};
exports.default = createSessionMiddleware;
