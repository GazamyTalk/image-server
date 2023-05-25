import { Request, Response } from "express";
import * as service from "./service";
import { serverConfig } from "./config/server";

export async function getImageData(req: Request, res: Response) : Promise<void> {
    // const pathSplited = strip(req.path, '/').split('/');
    // const filename = pathSplited[pathSplited.length - 1];
    const filename = req.params.filename;
    const redirectUrl = `${serverConfig.currentServerPath}/404.png`;

    if ( typeof filename !== "string" ) {
        res.redirect(redirectUrl);
        return;
    }

    const content = await service.getImageData(filename);
    if ( content instanceof Error ) {
        // console.log("debugger: getImageData Error:", content.message);
        res.redirect(redirectUrl);
        return;
    } else {
        res.status(200).contentType('png');
        res.send(content);
        return;
    }
}


// thanks for ChatGPT
export function addImageData(req: Request, res: Response) {
    if (req.is('image/png')) {
        // Access the raw request body as a buffer
        let imageData: Buffer[] = [];
        req.on('data', (chunk: Buffer) => {
            imageData.push(chunk);
        });
        req.on('end', () => (async () => {
            const content = Buffer.concat(imageData);
            const filename = await service.addImageData(content);
            res.status(201).send({ success: true, filename: filename });
        })());
    } else {
        res.status(400).send({ success: false });
    }
}