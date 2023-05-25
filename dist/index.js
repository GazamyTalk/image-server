"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session_middleware_1 = __importDefault(require("./middlewares/session.middleware"));
const route_1 = __importDefault(require("./route"));
const server_1 = require("./config/server");
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const port = server_1.serverConfig.port;
const app = (0, express_1.default)();
app.use((0, session_middleware_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// app.use((req, res, next) => {
//     console.log("--------------------");
//     console.log("req.path:", req.path);
//     console.log("req.query:", req.query);
//     console.log("req.body:", req.body);
//     console.log("req.session:", req.session);
//     console.log("req.headers:", req.headers);
//     next();
// })
app.use(`${server_1.serverConfig.currentServerPath}`, route_1.default);
app.use(error_middleware_1.default);
if (require.main === module) {
    app.listen(port, () => {
        console.log(`server is running at port ${port}`);
    });
}
exports.default = app;
