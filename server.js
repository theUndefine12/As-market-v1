import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './Routes/auth.routes.js'
import categoryRoutes from './Routes/category.routes.js'
import brandRoutes from './Routes/brand.routes.js'
import deviceRoutes from './Routes/device.routes.js'
import voucherRoutes from './Routes/voucher.routes.js'
import basketRoutes from './Routes/basket.routes.js'
import walletRoutes from './Routes/wallet.routes.js'
import purchasedRoutes from './Routes/purchased.routes.js'
import 'colors'

dotenv.config()


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/brand', brandRoutes)
app.use('/api/device', deviceRoutes)
app.use('/api/voucher', voucherRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/purchased', purchasedRoutes)
app.use('/api/basket', basketRoutes)


app.listen(port, () => {
    console.log(`Server run dev on port ${port}`.italic.bgBlue)
})

