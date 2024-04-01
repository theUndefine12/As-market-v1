import express from 'express'
import { check } from 'express-validator'
import { createcategory, deleteCategory, getCategories, getCategory } from '../Controller/category.controller.js'
import { authSecurity } from '../Middlewares/Auth.js'
import { checkAdmin } from '../Middlewares/Admin.js'


const router = express.Router()

router.route('/create').post(
    [
        check('name', 'Name is required').notEmpty()
    ],
    authSecurity, checkAdmin, createcategory
)
router.route('/').get(getCategories)
router.route('/:id').get(getCategory)
router.route('/:id').delete(authSecurity, checkAdmin, deleteCategory)


export default router