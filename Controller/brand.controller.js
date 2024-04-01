import asyncHandler from 'express-async-handler'
import prisma from '../db/prisma.js'
import { validationResult } from 'express-validator'



export const createBrand = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { name } = req.body
    try {
        const isHave = await prisma.brand.findFirst({
            where: { name: name }
        })
        if (!isHave) {
            const brand = await prisma.brand.create({
                data: {
                    name
                }
            })
            res.status(200).json({ brand })
        }

        res.status(400).json({ message: 'Brand with this name is already have' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const getBrands = asyncHandler(async (req, res) => {
    const brands = await prisma.brand.findMany({
        select: { id: true, name: true, devicesCount: true }
    })
    res.status(200).json({ brands })
})


export const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params

    const brandId = parseInt(id)
    const brand = await prisma.brand.findUnique({
        where: { id: brandId },
        include: {
            devices: {
                select: { id: true, name: true, price: true, categoryId: true, brandId: true, color: true, count: true }
            }
        }
    })
    if (!brand) {
        res.status(400).json({ message: 'Brand is not found' })
    }

    res.status(200).json({ brand })
})


export const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params

    const parsed = parseInt(id)
    const brand = await prisma.brand.delete({
        where: { id: parsed }
    })
    res.status(200).json({ message: 'Brand deleted succesfully' })
})


