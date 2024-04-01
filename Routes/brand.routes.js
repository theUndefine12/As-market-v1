import express from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../Middlewares/Auth.js'
import { checkAdmin } from '../Middlewares/Admin.js'
import { createBrand, deleteBrand, getBrand, getBrands } from '../Controller/brand.controller.js'


const router = express.Router()

router.route('/create').post(
    [
        check('name', 'Name is required').notEmpty()
    ],
    authSecurity, checkAdmin, createBrand
)
router.route('/').get(getBrands)
router.route('/:id').get(getBrand)
router.route('/:id').delete(authSecurity, checkAdmin, deleteBrand)


export default router