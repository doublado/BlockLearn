import { defineEventHandler, readBody, createError } from 'h3'
import pool from '~/server/db'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password, confirmPassword } = body

  if (!username || !email || !password || !confirmPassword) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields.' })
  }

  if (password !== confirmPassword) {
    throw createError({ statusCode: 400, statusMessage: 'Passwords do not match.' })
  }

  // Check if a user with the same username or email already exists.
  const existingUsers: any = await pool.execute(
    'SELECT id FROM users WHERE username = ? OR email = ?',
    [username, email]
  )
  if (existingUsers.length > 0) {
    throw createError({ statusCode: 400, statusMessage: 'User with this username or email already exists.' })
  }

  // Hash the password and insert the new user record.
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)
  const result: any = await pool.execute(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  )

  const insertId = result.insertId
  const userRows: any = await pool.execute(
    'SELECT id, username, email FROM users WHERE id = ?',
    [insertId]
  )

  if (!userRows || userRows.length === 0) {
    throw createError({ statusCode: 500, statusMessage: 'User creation failed.' })
  }

  const user = userRows[0]

  // Retrieve all levels to send back.
  const levels: any = await pool.execute(
    'SELECT id, level_number, name, description, requirements FROM levels ORDER BY level_number ASC'
  )

  return { success: true, message: 'User created successfully.', user, levels }
})
