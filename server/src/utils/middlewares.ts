import { NextFunction, Request, Response } from "express";
import { getGuildPermissionsService } from "../services/guilds";
import { User } from "../database/schemas/User";

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    req.isAuthenticated() ? next() : res.sendStatus(401);
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.isAuthenticated()) {
        const { id } = req.params;
        if (!id) {
            return res.sendStatus(403);
        } else {
            const valid = await getGuildPermissionsService((req.user as User).id, id);
            valid ? next() : res.sendStatus(403);
        }
    }else{
        res.sendStatus(401);
    }
}
