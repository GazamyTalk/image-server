import request from "supertest";
// import server from "../src";

import mysql from "mysql2/promise";
import fs from "fs/promises";
// import { createClient } from "redis";
// import { promisify } from "util";
// import { sessionStoreConfig } from "../src/config/connection";
// import { assertValue } from "../src/config/helpers";

import createSessionMiddleware from "../src/middlewares/session.middleware";
import express from "express";
import { assertValue } from "../src/config/helpers";
import path from "path";

const sessionServer = express();
sessionServer.use(createSessionMiddleware());
sessionServer.get('/getsess', (req, res) => {
    const username = req.query.username;
    if ( typeof username !== "string" ) throw new Error("makeSessionServer Error: username is not string");
    req.session.username = username;
    req.session.save((err) => {
        if (err) throw err;
        res.sendStatus(200);
    })
})
sessionServer.get('/delsess', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.sendStatus(200);
    })
})


export const loginDBConfig = {
    host: process.env.LOGIN_DB_HOST!,
    port: Number.parseInt(process.env.LOGIN_DB_PORT || "0"),
    user: process.env.LOGIN_DB_USER!,
    password: process.env.LOGIN_DB_PASSWORD!,
    database: process.env.LOGIN_DB_DATABASE!
};
assertValue(loginDBConfig, 'loginDBConfig', [undefined, NaN]);


// from ChatGPT
// Create a Redis client
// const client = createClient({ url: sessionStoreConfig.url });
// client.connect().catch(console.error);

// Promisify Redis functions for easier usage
// const setAsync = promisify(client.set).bind(client);
// const delAsync = promisify(client.del).bind(client);

// Function to create a test session in Redis
export async function createTestSession(username: string) : Promise<[string, string]> {
  // Generate a unique session ID or token

  // Craft the session object
//   const session = {
    // username: username,
    // Add any other relevant session data
//   };

  // Store the session in Redis
//   await setAsync(sessionid, JSON.stringify(session));
//   await client.set(sessionid, JSON.stringify(session));

    const response = await request(sessionServer).get(`/getsess?username=${username}`);
    if ( response.statusCode !== 200 ) throw new Error("createTestSession: statusCode is not 200");
    // console.log(response.headers);

    const sessionid = response.headers['set-cookie'][0].split('sessionid=')[1].split(';')[0];
    const sessionHeader = `sessionid=${sessionid}`;

    return [sessionid, sessionHeader];
}

export async function removeTestSession(sessionHeader: string) {
    // await delAsync(sessionid);
    const response = await request(sessionServer).get('/delsess').set('Cookie', sessionHeader);
    if ( response.statusCode !== 200 ) throw new Error("removeTestSession: statusCode is not 200");
}

// export async function closeSessionStore() {
//     await client.disconnect();
// }

export async function createTestAccount(userInfo: { username: string, password: string }) {
    const connection = await mysql.createConnection(loginDBConfig);
    await connection.connect();
    await connection.execute("INSERT INTO users(username, password) VALUES (?, SHA2(?, 256))", [userInfo.username, userInfo.password]);
    await connection.end();
}

export async function deleteTestAccount(username: string) {
    const connection = await mysql.createConnection(loginDBConfig);
    await connection.connect();
    await connection.execute("DELETE FROM users WHERE username=?", [username]);
    await connection.end();
}

export async function removeTestFile(filename: string) {
    await fs.unlink(path.join(__dirname, "../images", filename));
}