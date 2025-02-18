import {Router} from 'express'
import filesRoute  from './filesRoute.js'
const router = Router()

router.use('/files', filesRoute )

export default router