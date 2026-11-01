import { Router } from 'express'
import {
    createConversation,
    deleteConversation,
    getConversationMessages,
    getConversations,
    sendMessage,
    updateConversation
} from './conversation.controllers.js'
import { requiredAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.use(requiredAuth)

router.route('/').get(getConversations).post(createConversation)
router.route('/:conversationId/messages').get(getConversationMessages).post(sendMessage)
router.route('/:conversationId').patch(updateConversation).delete(deleteConversation)

export default router
