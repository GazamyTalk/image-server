import express, { NextFunction, Request, Response } from "express";
import { requireAuth } from "./middlewares/auth.middleware";
import { addImageData, getImageData } from "./controller";


function wrapAsyncController(asyncFn: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await asyncFn(req, res, next);
        } catch (err) {
            console.log(asyncFn.name);
            return next(err);
        }
    }
}

const router = express.Router();

// router.get('/:filename', requireAuth, wrapAsyncController(getImageData));
router.get('/:filename', wrapAsyncController(getImageData));
router.post('/', requireAuth, addImageData);

export default router;