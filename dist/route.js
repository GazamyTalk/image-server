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
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const controller_1 = require("./controller");
function wrapAsyncController(asyncFn) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield asyncFn(req, res, next);
        }
        catch (err) {
            console.log(asyncFn.name);
            return next(err);
        }
    });
}
const router = express_1.default.Router();
// router.get('/:filename', requireAuth, wrapAsyncController(getImageData));
router.get('/:filename', wrapAsyncController(controller_1.getImageData));
router.post('/', auth_middleware_1.requireAuth, controller_1.addImageData);
exports.default = router;
