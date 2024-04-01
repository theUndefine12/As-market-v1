import asyncHandler from 'express-async-handler'
import prisma from '../db/prisma.js'



export const getPurchased = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)

    try {
        const purchased = await prisma.purchased.findFirst({
            where: { userId: userId },
            select: {
                id: true, count: true,
                goods: { select: { id: true, name: true, image: true } }
            }
        })
        if (!purchased) {
            res.status(404).json({ message: 'Purchased is not found' })
        }

        res.status(200).json({ purchased })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})

