import { assertValue } from "./helpers";

export const sessionStoreConfig = {
    url: process.env.SESSION_STORE_URL!,
    secret: process.env.SESSION_SECRET!,
}
assertValue(sessionStoreConfig, 'sessionStoreConfig');