import express from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../Middlewares/Auth.js'
import { getWallet, replenishWallet } from '../Controller/wallet.controller.js'


const router = express.Router()

router.route('/').get(authSecurity, getWallet)
router.route('/replenish').post(
    [
        check('code', 'Code is required').notEmpty()
    ],
    authSecurity, replenishWallet
)


export default router