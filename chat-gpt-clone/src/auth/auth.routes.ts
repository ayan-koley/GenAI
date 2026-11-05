import { Router } from 'express'
import { upserUser } from './auth.controllers.js'

const router = Router()
router.route("/sync").post(upserUser);

export default router