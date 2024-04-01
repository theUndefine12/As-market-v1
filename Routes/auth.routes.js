import express from 'express'
import { check } from 'express-validator'
import { authLogin, authRegister, authUsers, getProfile } from '../Controller/auth.controller.js'
import { authSecurity } from '../Middlewares/Auth.js'


const router = express.Router()

router.route('/register').post(
    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Email is required').notEmpty(),
        check('password', 'Password is required and need not be short that than 8').isLength({ min: 8, max: 12 }),
    ],
    authRegister
)
router.route('/login').post(
    [
        check('email', 'Email is required').notEmpty(),
        check('password', 'Password is required and need not be short that than 8').isLength({ min: 8, max: 12 }),
    ],
    authLogin
)
router.route('/users').get(authUsers)
router.route('/profile').get(authSecurity, getProfile)


export default router