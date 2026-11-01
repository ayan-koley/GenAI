import { Request, Response } from "express";
import { upsertUserFromClerk } from "./auth.services.js";

export async function upserUser(req: Request, res: Response) {
    try {
        const user = await upsertUserFromClerk(req);
        res.status(200).json(
            {
                message: "User upserted successfully",
                user
            }
        );
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
} 