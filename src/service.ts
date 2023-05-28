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

export async function isExistFile(filename: string) : Promise<boolean> {
    try {
        await fs.access(filename);
        return true;
    } catch {
        return false;
    }
}

export async function copyDefaultImages(defaultDir: string, imagesDir: string) {
    await fs.mkdir(imagesDir, { recursive: true });
    const files = await fs.readdir(defaultDir);
    const promises = files.map(async (filename) => {

        const srcPath = path.join(defaultDir, filename);
        const dstPath = path.join(imagesDir, filename);

        if ( await isExistFile(dstPath) ) return;
        
        await fs.copyFile(srcPath, dstPath);

    })
    await Promise.all(promises);
}

function generateRandomFilename() : string {
    return randomString(12) + '.png';
}

function isAccessibleFilename(filename: string) : boolean {
    if ( !filename.endsWith('.png') ) return false;
    else if ( filename.slice(0, filename.length-4).match(/[^a-zA-Z0-9]/) ) return false;
    else return true;
}