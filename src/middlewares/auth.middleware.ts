import express, { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if ( req.session?.username === undefined ) {
        // res.send({ status: 401, success: false, error: "login first" });
        res.status(401).send({ success: false, error: "login first" });
        return;
    }
    next();
}

export function requireNotAuth(req: Request, res: Response, next: NextFunction) {
    if ( req.session?.username !== undefined ) {
        res.status(409).send({ success: false, error: "already logged in" });
        return;
    }
    next();
}