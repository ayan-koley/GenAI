import { Request } from "express";
import {prisma} from "../lib/prisma.js"
import { clerkClient, getAuth } from "@clerk/express";

export async function upsertUserFromClerk(req: Request) {
    try {
        // 1. Get the authenticated Clerk userId from the verified request.
        // 2. Fetch the user's profile details from Clerk (email, name, avatar).
        // 3. Use Prisma upsert with clerkId as the unique key.
        // 4. Create the user record if it doesn't exist.
        // 5. Update relevant profile fields if the user already exists.
        // 6. Return the synced user data to the frontend.
        // 7. Handle database or Clerk API errors gracefully.

        const { isAuthenticated ,userId } = getAuth(req)
        if(!isAuthenticated || !userId) {
            throw new Error("User is not authenticated with Clerk.");
        }

        const clerkUser = await clerkClient.users.getUser(userId);

        if (!clerkUser) {
            throw new Error("Failed to fetch user from Clerk.");
        }

        const user = await prisma.user.upsert({
            where: { clear_id: clerkUser.id },
            update: {
                email: clerkUser?.emailAddresses[0].emailAddress,
                fullName: clerkUser?.fullName,
                imageUrl: clerkUser?.imageUrl
            },
            create: {
                clear_id: clerkUser.id,
                email: clerkUser?.emailAddresses[0].emailAddress,
                fullName: clerkUser?.fullName,
                imageUrl: clerkUser?.imageUrl
            }
        })

        return user;
    } catch (err: any) {
        throw new Error(`Failed to upsert user from Clerk: ${err.message}`);
    }
}