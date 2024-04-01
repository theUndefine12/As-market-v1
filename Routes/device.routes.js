import express from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../Middlewares/Auth.js'
import { checkAdmin } from '../Middlewares/Admin.js'
import { addToBasket, buyDevice, createDevice, deleteDevice, getDevice, getDevices, updateDevice } from '../Controller/device.controller.js'


const router = express.Router()

router.route('/create').post(
    [
        check('name', 'Name is required').notEmpty(),
        check('price', 'price is required and be a Number').notEmpty().isNumeric(),
        check('image', 'Image need be a url').optional().isURL(),
        check('color', 'Color is required').notEmpty(),
        check('count', 'Count is required and be a number').optional().notEmpty().isNumeric(),
        check('category', 'Category is required').notEmpty(),
        check('brand', 'Brand is required').notEmpty(),
    ],
    authSecurity, checkAdmin, createDevice
)
router.route('/:id').put(
    [
        check('name', 'Name is required').optional().notEmpty(),
        check('price', 'price is required and be a Number').optional().notEmpty().isNumeric(),
        check('image', 'Image need be a url').optional().isURL(),
        check('color', 'Color is required').optional().notEmpty(),
        check('count', 'Count is required and be a number').optional().notEmpty().isNumeric(),
    ],
    authSecurity, checkAdmin, updateDevice
)
router.route('/:id/buy').post(
    [
        check('count', 'count is required').notEmpty(),
    ],
    authSecurity, buyDevice
)
router.route('/').get(getDevices)
router.route('/:id').get(getDevice)
router.route('/:id').delete(authSecurity, checkAdmin, deleteDevice)
router.route('/:id/addTobasket').post(authSecurity, addToBasket)


export default router