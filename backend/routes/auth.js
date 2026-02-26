import { Router } from 'express'
import { signup, login, listUsers } from '../controllers/authController.js'

const r = Router()
r.post('/signup', signup)
r.post('/login', login)
r.get('/users', listUsers)
export default r
