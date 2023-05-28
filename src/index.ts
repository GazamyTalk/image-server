import express from "express";
import createSessionMiddleware from "./middlewares/session.middleware";
import route from "./route";
import { serverConfig } from "./config/server";
import errorHandler from "./middlewares/error.middleware";
import * as service from "./service";
import path from "path";

const port = serverConfig.port;
const app = express();

app.use(createSessionMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//     console.log("--------------------");
//     console.log("req.path:", req.path);
//     console.log("req.query:", req.query);
//     console.log("req.body:", req.body);
//     console.log("req.session:", req.session);
//     console.log("req.headers:", req.headers);
//     next();
// })
app.use(`${serverConfig.currentServerPath}`, route);
app.use(errorHandler);

const imagesDirPath =
    serverConfig.imagesDirPath[0] === '/'
    ? serverConfig.imagesDirPath
    : path.join(__dirname, '..', serverConfig.imagesDirPath);
(async () => await service.copyDefaultImages(
    path.join(__dirname, '../defaultImages'),  //이거 환경변수로 만들어야 할거같다. 도커에 어떻게...
    imagesDirPath)
)();

if ( require.main === module ) {
    app.listen(port, async () => {
        console.log(`server is running at port ${port}`);
    })
}

export default app;