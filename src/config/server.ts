import { assertValue } from "./helpers"

export const serverConfig = {
    currentServerPath: process.env.CURRENT_SERVER_PATH!,
    port: process.env.SERVER_PORT!,
    imagesDirPath: process.env.IMAGES_DIR_PATH!,
}
assertValue(serverConfig, "serverConfig");