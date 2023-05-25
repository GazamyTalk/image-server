"use strict";
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
exports.addImageData = exports.getImageData = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const randomString_1 = __importDefault(require("./utils/randomString"));
function getImageData(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(__dirname, "../images", filename);
        if (!(isAccessibleFilename(filename) &&
            (yield isExistFile(filePath)))) {
            return new Error(`invalid filename: ${filename}`);
        }
        const content = yield promises_1.default.readFile(filePath);
        return content;
    });
}
exports.getImageData = getImageData;
function addImageData(content) {
    return __awaiter(this, void 0, void 0, function* () {
        let filename;
        let filePath;
        while (yield isExistFile(filePath = path_1.default.join(__dirname, "../images", (filename = generateRandomFilename())))) { }
        yield promises_1.default.writeFile(filePath, content);
        return filename;
    });
}
exports.addImageData = addImageData;
function isExistFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield promises_1.default.access(filename);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
function generateRandomFilename() {
    return (0, randomString_1.default)(12) + '.png';
}
function isAccessibleFilename(filename) {
    if (!filename.endsWith('.png'))
        return false;
    else if (filename.slice(0, filename.length - 4).match(/[^a-zA-Z0-9]/))
        return false;
    else
        return true;
}
