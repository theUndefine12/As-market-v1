import express from 'express'
import { authSecurity } from '../Middlewares/Auth.js'
import { getPurchased } from '../Controller/purchased.controller.js'


const router = express.Router()

router.route('/').get(authSecurity, getPurchased)


export default router