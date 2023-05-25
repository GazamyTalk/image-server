import fs from "fs/promises";
import { serverConfig } from "./config/server";
import path from "path";
import randomString from "./utils/randomString";

export async function getImageData(filename: string) : Promise<Buffer | Error> {
    const filePath = path.join(__dirname, "../images", filename);
    if (!(
        isAccessibleFilename(filename) &&
        await isExistFile(filePath)
        )) {
            return new Error(`invalid filename: ${filename}`);
        }
    const content = await fs.readFile(filePath);
    return content;
}

export async function addImageData(content: Buffer) : Promise<string> {
    let filename: string;
    let filePath: string;
    while (await isExistFile(filePath = path.join(__dirname, "../images", (filename = generateRandomFilename())))) {}
    await fs.writeFile(filePath, content);
    return filename;
}

async function isExistFile(filename: string) : Promise<boolean> {
    try {
        await fs.access(filename);
        return true;
    } catch {
        return false;
    }
}

function generateRandomFilename() : string {
    return randomString(12) + '.png';
}

function isAccessibleFilename(filename: string) : boolean {
    if ( !filename.endsWith('.png') ) return false;
    else if ( filename.slice(0, filename.length-4).match(/[^a-zA-Z0-9]/) ) return false;
    else return true;
}