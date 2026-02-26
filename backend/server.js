import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import sessionRoutes from './routes/sessions.js'
import attendanceRoutes from './routes/attendance.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.get('/', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/attendance', attendanceRoutes)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`SmartMark API on ${port}`)
})
