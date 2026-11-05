import express from 'express';
import { clerkMiddleware } from '@clerk/express'

const app = express();
app.use(clerkMiddleware());



app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ extended: true }));

import authRoutes from './auth/auth.routes.js';
import conversationRoutes from './conversation/conversation.routes.js';
import messageRoutes from './message/message.routes.js';
import { sendMessage } from './message/message.controllers.js';

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});
app.post("/api/v1/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/conversations", conversationRoutes);
app.use("/api/v1/message", messageRoutes);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default app;
