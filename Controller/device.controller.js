import asyncHandler from 'express-async-handler'
import prisma from '../db/prisma.js'
import { validationResult } from 'express-validator'



export const createDevice = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'please check your request', errors })
    }
    const { name, image, price, category, brand, color, count } = req.body
    try {

        const isCategory = await prisma.category.findFirst({
            where: { name: category }
        })
        if (!isCategory) {
            res.status(404).json({ message: 'Category is not found' })
        }

        let isBrand = await prisma.brand.findFirst({
            where: { name: brand }
        })
        if (!isBrand) {
            isBrand = await prisma.brand.create({
                data: { name: brand }
            })
        }

        const device = await prisma.device.create({
            data: {
                name,
                image,
                price,
                count,
                color,
                category: { connect: { id: isCategory.id } },
                brand: { connect: { id: isBrand.id } }
            }
        })

        await prisma.category.update({
            where: { id: isCategory.id },
            data: {
                devicesCount: {
                    increment: 1
                },
                devices: {
                    connect: { id: device.id }
                }
            }
        })

        await prisma.brand.update({
            where: { id: isBrand.id },
            data: {
                devicesCount: {
                    increment: 1
                },
                devices: {
                    connect: { id: device.id }
                }
            }
        })

        res.status(200).json({ device })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const getDevices = asyncHandler(async (req, res) => {
    const devices = await prisma.device.findMany({
        select: { id: true, name: true, image: true, price: true }
    })
    res.status(200).json({ devices })
})


export const getDevice = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const deviceId = parseInt(id)
        const device = await prisma.device.findUnique({
            where: { id: deviceId },
            select: { id: true, name: true, price: true, categoryId: true, brandId: true, color: true, count: true }
        })

        if (!device) {
            res.status(404).json({ message: 'Device not found' })
        }

        res.status(200).json({ device })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const updateDevice = asyncHandler(async (req, res) => {
    const { id } = req.params
    const data = req.body

    try {
        const deviceId = parseInt(id)
        const device = await prisma.device.update({
            where: { id: deviceId },
            data: data
        })

        if (!device) {
            res.status(404).json({ message: 'Device not found' })
        }

        res.status(200).json({ message: 'Device updated !' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const deleteDevice = asyncHandler(async (req, res) => {
    const { id } = req.params
    const deviceId = parseInt(id)

    try {
        const device = await prisma.device.findUnique({
            where: { id: deviceId },
            include: { category: true, brand: true }
        })

        if (!device) {
            return res.status(404).json({ message: 'Device not found' })
        }

        const categoryId = device.category.id
        const brandId = device.brand.id

        await prisma.device.delete({
            where: { id: deviceId }
        })

        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: {
                devicesCount: {
                    decrement: 1
                }
            }
        })

        const updatedBrand = await prisma.brand.update({
            where: { id: brandId },
            data: {
                devicesCount: {
                    decrement: 1
                }
            }
        })

        if (updatedCategory && updatedBrand) {
            return res.status(200).json({ message: 'Device deleted successfully' })
        }

        return res.status(400).json({ message: 'Error in Device Delete' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Sorry, error in Server' })
    }
})


export const addToBasket = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const { id } = req.params

    try {
        const deviceId = parseInt(id)
        const device = await prisma.device.findUnique({
            where: { id: deviceId },
        })

        if (!device) {
            res.status(404).json({ message: 'Device not found' })
        }

        const basket = await prisma.basket.findFirst({
            where: { userId: userId }
        })
        if (!basket) {
            res.status(404).json({ message: 'Basket not found' })
        }

        await prisma.basket.update({
            where: { id: basket.id },
            data: {
                devicesCount: {
                    increment: 1
                },
                devices: {
                    connect: { id: device.id }
                }
            }
        })

        res.status(200).json({ message: 'Device added to Basket' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const buyDevice = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'please check your request', errors })
    }

    const userId = parseInt(req.userId)
    const { id } = req.params
    const { count } = req.body

    try {
        const deviceId = parseInt(id)

        const device = await prisma.device.findUnique({
            where: { id: deviceId }
        })
        if (!device) {
            res.status(404).json({ message: 'Device is not found' })
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { Wallet: true, Purchased: true }
        })
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const wallet = await prisma.wallet.findFirst({
            where: { id: user.Wallet.id }
        })
        if (!wallet) {
            res.status(404).json({ message: 'Wallet is not found' })
        }

        const purchsed = await prisma.purchased.findFirst({
            where: { id: user.Purchased.id }
        })
        if (!purchsed) {
            res.status(404).json({ message: 'Purchased is not found' })
        }

        const devicePrice = device.price * count
        const userCash = wallet.cash
        const buyCount = count

        if (userCash > devicePrice) {
            await prisma.wallet.update({
                where: { id: wallet.id },
                data: {
                    cash: {
                        decrement: devicePrice
                    }
                }
            })
        } else {
            res.status(400).json({ message: 'Have not enought cash' })
        }

        if (userCash > devicePrice) {
            await prisma.device.update({
                where: { id: device.id },
                data: {
                    count: {
                        decrement: buyCount
                    }
                }
            })
        } else {
            res.status(400).json({ message: 'Have not enought cash' })
        }

        if (userCash > devicePrice) {
            await prisma.purchased.update({
                where: { id: purchsed.id },
                data: {
                    count: {
                        increment: 1
                    },
                    goods: {
                        connect: { id: device.id }
                    }
                }
            })
        } else {
            res.status(400).json({ message: 'Have not enought cash' })
        }

        res.status(200).json({ message: 'Device bought Successfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Sorry, error in Server' })
    }
})

