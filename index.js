const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const PORT = process.env.PORT
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
app.set('view engine', 'ejs')
const Donor = require('./models/donor.models')
const donorRoutes = require('./routes/donor.routes')
const adminRoutes = require('./routes/admin.routes')
const ngoRoutes = require('./routes/ngo.routes')
const contactRoutes = require('./routes/contact.routes')
const cors = require('cors')
const { sendDonorWelcomeEmail, sendNGOWelcomeEmail } = require('./utils/emailService')

app.use(cors({
    origin: ['https://front-project-phi.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running' })
})

// Email test endpoint
app.post('/test-email', async (req, res) => {
    try {
        const { email, type } = req.body
        if (!email || !type) {
            return res.status(400).json({ success: false, message: 'Email and type required' })
        }

        let result
        if (type === 'donor') {
            result = await sendDonorWelcomeEmail('Test User', email)
        } else if (type === 'ngo') {
            result = await sendNGOWelcomeEmail('Test Contact', email, 'Test NGO')
        } else {
            return res.status(400).json({ success: false, message: 'Invalid type' })
        }

        res.status(200).json({ success: result.success, message: result.message })
    } catch (err) {
        console.error('Test email error:', err)
        res.status(500).json({ success: false, message: err.message })
    }
})

app.use('/donor', donorRoutes)
app.use('/admin', adminRoutes)
app.use('/ngo', ngoRoutes)
app.use('/contact', contactRoutes)

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.log(err));

app.listen(4500, () => console.log('Server is running on port 4500'))
