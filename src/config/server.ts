import { assertValue } from "./helpers"

export const serverConfig = {
    currentServerPath: process.env.CURRENT_SERVER_PATH!,
    port: process.env.SERVER_PORT!,
}
assertValue(serverConfig, "serverConfig");