import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import server from "../src";
import fs from "fs/promises";
import { createTestAccount, createTestSession, deleteTestAccount, removeTestFile, removeTestSession } from "./helpers";
import path from "path";

describe("test /images", () => {

    let imageData: Buffer;
    let filename: string;
    let session: string;
    let sessionHeader: string;
    const credentials = {
        username: "__dev_test_images_username",
        password: "__dev_test_images_password",
    }

    beforeAll(async () => {
        imageData = await fs.readFile(path.join(__dirname, "./testImage.png"));
        await createTestAccount(credentials);
        [session, sessionHeader] = await createTestSession(credentials.username);
    })

    test("GET /abc.png must be raise error", async () => {
        const response = await request(server)
            .get('/images/abc.png');
        expect(response.statusCode).toBe(302);
    })

    test("POST /", async () => {
        const response = await request(server)
            .post('/images')
            .set('Cookie', sessionHeader)
            .send(imageData)
            .type('image/png');
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            success: true
        })
        expect(response.body.filename === undefined).toBe(false);
        filename = response.body.filename;
    })

    test("GET /:id", async () => {
        const response = await request(server)
            .get(`/images/${filename}`);
        expect(response.statusCode).toBe(200);
        // console.log(response.body);
        // console.log(imageData);
        expect(response.body.toString()).toBe(imageData.toString());
    })

    afterAll(async () => {
        await deleteTestAccount(credentials.username);
        await removeTestSession(session);
        await removeTestFile(filename);
    })

})