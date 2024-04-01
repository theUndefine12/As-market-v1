import asyncHandler from 'express-async-handler'
import prisma from '../db/prisma.js'
import { validationResult } from 'express-validator'



export const createcategory = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { name } = req.body
    try {
        const isHave = await prisma.category.findFirst({
            where: { name: name }
        })
        if (!isHave) {
            const category = await prisma.category.create({
                data: {
                    name: name
                }
            })
            res.status(200).json({ category })
        }

        res.status(400).json({ message: 'Category with this name is already have' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const getCategories = asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany()
    res.status(200).json({ categories })
})


export const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params

    const categoryId = parseInt(id)
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: { devices: {
            select: { id: true, name: true, price: true, categoryId: true, brandId: true, color: true, count: true }
        } }
    })
    if (!category) {
        res.status(400).json({ message: 'Category is not found' })
    }

    res.status(200).json({ category })
})


export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params

    const parsed = parseInt(id)
    const category = await prisma.category.delete({
        where: { id: parsed }
    })
    res.status(200).json({ message: 'Category deleted succesfully' })
})
