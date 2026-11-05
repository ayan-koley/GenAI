import express from 'express';
import { clerkMiddleware } from '@clerk/express'

const app = express();
app.use(clerkMiddleware());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './auth/auth.routes.js';
import conversationRoutes from './conversation/conversation.routes.js';

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});
app.use("api/v1/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);

export default app;
