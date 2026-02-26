import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, '..', 'data')

async function ensure() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch {}
}

async function read(file) {
  await ensure()
  const p = path.join(dataDir, file)
  try {
    const raw = await fs.readFile(p, 'utf-8')
    return JSON.parse(raw || '[]')
  } catch {
    return []
  }
}

async function write(file, data) {
  await ensure()
  const p = path.join(dataDir, file)
  await fs.writeFile(p, JSON.stringify(data, null, 2))
}

export const readUsers = () => read('users.json')
export const writeUsers = data => write('users.json', data)

export const readSessions = () => read('sessions.json')
export const writeSessions = data => write('sessions.json', data)

export const readAttendance = () => read('attendance.json')
export const writeAttendance = data => write('attendance.json', data)
