import { defineEventHandler, readBody, createError } from 'h3'
import pool from '~/server/db'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { identifier, password } = body

  if (!identifier || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields.' })
  }

  const userRows: any = await pool.execute(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [identifier, identifier]
  )
  
  if (!userRows || userRows.length === 0) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials.' })
  }
  const user = userRows[0]
  const valid = bcrypt.compareSync(password, user.password_hash)

  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials.' })
  }

  const returnedUser = { id: user.id, username: user.username, email: user.email }

  const levels: any = await pool.execute(
    'SELECT id, level_number, name, description, requirements FROM levels ORDER BY level_number ASC'
  )

  const progress: any = await pool.execute(
    'SELECT level_id, stars, completed_at FROM user_level_progress WHERE user_id = ?',
    [user.id]
  )

  return {
    success: true,
    message: 'Signed in successfully.',
    user: returnedUser,
    levels,
    levelProgress: progress
  }
})
