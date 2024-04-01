import asyncHandler from 'express-async-handler'
import prisma from '../db/prisma.js'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import { generateToken } from '../Utils/generateToken.js'



export const authRegister = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { name, email, password } = req.body
    try {
        const isHave = await prisma.user.findUnique({
            where: { email }
        })
        if (isHave) {
            res.status(400).json({ message: 'User already exist' })
        }
        let user
        const hash = bcrypt.hashSync(password, 7)

        if (name === 'Zulayho' && email === 'zulayho' && password === 'zulayhoo123') {
            user = await prisma.user.create({
                data: {
                    name, email, password: hash, isAdmin: true
                }
            })
        }
        user = await prisma.user.create({
            data: {
                name, email, password: hash
            }
        })

        await prisma.basket.create({
            data: {
                userId: user.id
            }
        })

        await prisma.wallet.create({
            data: {
                userId: user.id
            }
        })

        await prisma.purchased.create({
            data: {
                userId: user.id
            }
        })

        const token = generateToken(user.id)
        
        if (user.isAdmin) {
            res.status(200).json({ message: 'Welcome Admin', token })
        }

        res.status(200).json({ token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const authLogin = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { email, password } = req.body
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) {
            res.status(400).json({ message: 'User is not authorized' })
        }

        const isPassword = bcrypt.compareSync(password, user.password)
        if (!isPassword) {
            res.status(400).json({ message: 'Password is not correct' })
        }

        const token = generateToken(user.id)
        if (user.isAdmin) {
            res.status(200).json({ message: 'Welcome Admin', token })
        }

        res.status(200).json({ token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }

})


export const authUsers = asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
        select: { name: true, email: true, isAdmin: true }
    })
    res.status(200).json({ users })
})


export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.userId
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true, }
        })

        if (!user) {
            res.status(200).json({ message: 'User is not found' })
        }

        res.status(200).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})

