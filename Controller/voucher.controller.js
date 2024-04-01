import asyncHandler from 'express-async-handler'
import prisma from '../db/prisma.js'
import { validationResult } from 'express-validator'



export const createVaucher = asyncHandler(async (req, res) => {
    const errrors = validationResult(req)
    if (!errrors.isEmpty()) {
        res.status(400).json({ message: 'Please check yout request', errrors })
    }
    const { code, cash } = req.body
    try {
        const vaucher = await prisma.voucher.create({
            data: {
                code: code,
                cash: cash
            }
        })

        res.status(200).json({ message: 'Voucher created!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getVouchers = asyncHandler(async (req, res) => {
    const vouchers = await prisma.voucher.findMany({
        include: { users: true }
    })
    res.status(200).json({ vouchers })
})


export const getVoucher = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const parsed = parseInt(id)
        const voucher = await prisma.voucher.findUnique({
            where: { id: parsed },
            include: { users: true }
        })
        if (!voucher) {
            res.status(404).json({ message: 'Vouher is not found' })
        }

        res.status(200).json({ voucher })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const updateVoucher = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { code, cash } = req.body
    try {
        const voucher = await prisma.voucher.findUnique({
            where: { id: id }
        })
        if (!voucher) {
            res.status(404).json({ message: 'voucher is not Found' })
        }

        await prisma.voucher.update({
            where: { id: id },
            data: {
                code: code,
                cash: cash
            }
        })

        res.status(200).json({ message: 'Voucher code is updated!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const deleteVoucher = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const voucher = await prisma.voucher.findUnique({
            where: { id: id }
        })
        if (!voucher) {
            res.status(404).json({ message: 'voucher is not Found' })
        }

        await prisma.voucher.delete({
            where: { id: id }
        })

        res.status(200).json({ message: 'Voucher is deleted !' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


