"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session_middleware_1 = __importDefault(require("./middlewares/session.middleware"));
const route_1 = __importDefault(require("./route"));
const server_1 = require("./config/server");
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const service = __importStar(require("./service"));
const path_1 = __importDefault(require("path"));
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
const imagesDirPath = server_1.serverConfig.imagesDirPath[0] === '/'
    ? server_1.serverConfig.imagesDirPath
    : path_1.default.join(__dirname, '..', server_1.serverConfig.imagesDirPath);
(() => __awaiter(void 0, void 0, void 0, function* () {
    return yield service.copyDefaultImages(path_1.default.join(__dirname, '../defaultImages'), //이거 환경변수로 만들어야 할거같다. 도커에 어떻게...
    imagesDirPath);
}))();
if (require.main === module) {
    app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`server is running at port ${port}`);
    }));
}
exports.default = app;
