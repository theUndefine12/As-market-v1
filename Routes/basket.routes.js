import express from 'express'
import { authSecurity } from '../Middlewares/Auth.js'
import { deleteDevice, getBasket } from '../Controller/basket.controller.js'


const router = express.Router()

router.route('/').get(authSecurity, getBasket)
router.route('/:id').post(authSecurity, deleteDevice)


export default router