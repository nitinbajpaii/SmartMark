import { Router } from 'express'
import { create, list, start, end, remove } from '../controllers/sessionsController.js'

const r = Router()
r.post('/create', create)
r.get('/', list)
r.post('/start', start)
r.post('/end', end)
r.delete('/:id', remove)
export default r
