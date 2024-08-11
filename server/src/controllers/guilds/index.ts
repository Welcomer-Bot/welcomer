import { Request, Response } from "express";
import { getMutualGuildsService, fetchGuildService, getGuildService } from "../../services/guilds";
import { User } from "../../database/schemas/User";

export async function getGuildsController(req: Request, res: Response) {
    try {
        const user = req.user as User;
        const guilds = await getMutualGuildsService(user.id);
        res.send(guilds);
    } catch(error:any) {
        res.status(400).send({error: error.message});
    }
}
 
export async function getGuildController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const guild = await getGuildService(id);
        guild ? res.send(guild) : res.status(404).send({ message: "Guild not found." });
    } catch (error: any) {
        console.log(error);
        res.status(400).send({error: error.message });
    }
}

export async function getBotGuildController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const guild = await getGuildService(id);
        guild ? res.send(guild) : res.status(404).send({ message: "Guild not found." });
    } catch (error:any) {
        res.status(400).send({error: error.message});
    }
}

export async function getGuildPermissionsController(req: Request, res: Response) {
    try {
        const user = req.user as User;
        const { id } = req.params;
        const guilds = await getMutualGuildsService(user.id);
        const valid = guilds.some((guild) => guild.id === id);
        valid ? res.sendStatus(200) : res.sendStatus(403);
    } catch (error:any) {
        res.status(400).send({error: error.message });
    }
}
