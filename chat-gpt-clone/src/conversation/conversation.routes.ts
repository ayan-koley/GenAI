import { Router } from 'express'
import {
    createConversation,
    deleteConversation,
    getConversationMessages,
    getConversations,
    updateConversation
} from './conversation.controllers.js'
import { requiredAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.use(requiredAuth)

router.route('/').get(getConversations).post(createConversation)
router.route('/:conversationId/messages').get(getConversationMessages)
router.route('/:conversationId').patch(updateConversation).delete(deleteConversation)

export default router
