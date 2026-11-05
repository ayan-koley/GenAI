import { clerkClient, getAuth } from "@clerk/express";
import { NextFunction, Response, Request } from "express";
import { prisma } from "../lib/prisma.js";

export async function requiredAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { isAuthenticated, userId } = getAuth(req);
        if(!isAuthenticated || !userId) {
            throw new Error("User is not authenticated");
        }

        const clerkUser = await clerkClient.users.getUser(userId);
        if(!clerkUser) {
            throw new Error("User not found in clerk");
        }

        const user = await prisma.user.findFirst({
            where: {
                clear_id: clerkUser.id
            },
            select: {
                id: true,
                clear_id: true,
                email: true,
                fullName: true
            }
        });
        if(!user) {
            throw new Error("User not found in database");
        }
        req.user = user;
        next();
    } catch (error: any) {
        throw new Error(`Required authentication failed: ${error.message}`);
    }
}