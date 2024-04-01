import asyncHandler from 'express-async-handler'
import prisma from '../db/prisma.js'



export const getBasket = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            Basket: {
                include: {
                    devices: {
                        select: {
                            id: true, name: true, image: true, price: true
                        }
                    }
                }
            }
        }
    })

    if (!user || !user.Basket) {
        res.status(404).json({ message: 'Basket is not found' })
    }

    const basket = user.Basket[0]
    res.status(200).json({ basket })
})


export const deleteDevice = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const { id } = req.params

    const deviceId = parseInt(id)
    const device = await prisma.device.findUnique({
        where: { id: deviceId }
    })
    if (!device) {
        res.status(404).json({ message: 'Device is not found' })
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { Basket: true }
    })
    if (!user || !user.Basket) {
        res.status(404).json({ message: 'Basket is not found' })
    }

    const basket = await prisma.basket.findFirst({
        where: { id: user.Basket.id },
        include: { devices: true }
    })

    const deviceExistsInBasket = basket.devices.some(basketDevice => basketDevice.id === deviceId)

    if (deviceExistsInBasket) {
        await prisma.basket.update({
            where: { id: basket.id },
            data: {
                devicesCount: {
                    decrement: 1
                },
                devices: {
                    disconnect: { id: device.id }
                }
            }
        })
        res.status(200).json({ message: 'Device Deleted !' })
    }

    res.status(404).json({ message: 'Device not found in basket' })
})
