import { Router } from 'express'
import { mark, byStudent, bySession, removeBySession, removeByStudent, removeOne, removeAll } from '../controllers/attendanceController.js'

const r = Router()
r.post('/mark', mark)
r.get('/student/:id', byStudent)
r.get('/session/:id', bySession)
// deletion endpoints
r.delete('/all', removeAll)
r.delete('/session/:id', removeBySession)
r.delete('/student/:id', removeByStudent)
r.delete('/:id', removeOne)
export default r
