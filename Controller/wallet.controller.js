import asyncHandler from 'express-async-handler'
import prisma from '../db/prisma.js'
import { validationResult } from 'express-validator'



export const getWallet = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { Wallet: true }
    })
    if (!user || !user.Wallet) {
        res.status(404).json({ message: 'Wallet is not found' })
    }

    const wallet = user.Wallet[0]

    res.status(200).json({ wallet })
})


export const replenishWallet = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = parseInt(req.userId)
    const { code } = req.body

    try {
        const wallet = await prisma.wallet.findFirst({
            where: { userId: userId }
        })
        if (!wallet) {
            res.status(404).json({ message: 'Wallet is not found' })
        }

        const isCode = await prisma.voucher.findUnique({
            where: { code: code },
            include: { users: true }
        })
        if (!isCode) {
            res.status(404).json({ message: 'Voucher Code is not found' })
        }

        if (isCode.users.some(user => user.id === userId)) {
            res.status(400).json({ message: 'Voucher is Activated Already' });
        }

        if (!isCode.users.some(user => user.id === userId)) {
            const voucherCash = isCode.cash
            await prisma.wallet.update({
                where: { id: wallet.id },
                data: {
                    cash: {
                        increment: voucherCash
                    }
                }
            })
        }

        if (!isCode.users.some(user => user.id === userId)) {
            await prisma.voucher.update({
                where: { code: code },
                data: {
                    users: {
                        connect: { id: userId }
                    }
                }
            })
        }

        res.status(200).json({ message: 'Voucher is activated' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry, there was an error in the server' })
    }
})

