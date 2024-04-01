import express from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../Middlewares/Auth.js'
import { checkAdmin } from '../Middlewares/Admin.js'
import { createVaucher, deleteVoucher, getVoucher, getVouchers, updateVoucher } from '../Controller/voucher.controller.js'


const router = express.Router()

router.route('/create').post(
    [
        check('code', 'Code is required and dont be short that than 8 symbold').isLength({min: 8, max:12}),
        check('cash', 'Cash is not be empty and be a Numberic').notEmpty().isNumeric()
    ],
    authSecurity, checkAdmin, createVaucher
)
router.route('/:id').get(authSecurity, checkAdmin, getVoucher)
router.route('/').get(authSecurity, checkAdmin, getVouchers)
router.route('/:id').put(
    [
        check('code', 'Code is required and dont be short that than 8 symbold').isLength({ min: 8, max: 12 }),
        check('cash', 'Cash is not be empty and be a Numberic').notEmpty().isNumeric()
    ],
    authSecurity, checkAdmin, updateVoucher
)
router.route('/:id').delete(authSecurity, checkAdmin, deleteVoucher)


export default router