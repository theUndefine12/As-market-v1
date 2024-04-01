import prisma from '../db/prisma.js'

export const checkAdmin = async (req, res, next) => {
    const userId = req.userId
    try {
        const admin = await prisma.user.findUnique({
            where: { id: userId }
        })
        if (!admin) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (admin.isAdmin !== true) {
            return res.status(403).json({ message: 'You are not an admin' })
        }

        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry, error in middleware' })
    }
}
