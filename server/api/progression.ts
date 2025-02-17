import { defineEventHandler, readBody, createError } from 'h3'
import pool from '~/server/db'

/**
 * Recursively converts any BigInt values to strings.
 * You can change to Number(val) if you're sure the values are safe.
 */
function convertBigInt(data: any): any {
  if (typeof data === 'bigint') {
    return data.toString()
  } else if (Array.isArray(data)) {
    return data.map(convertBigInt)
  } else if (data !== null && typeof data === 'object') {
    for (const key in data) {
      data[key] = convertBigInt(data[key])
    }
    return data
  } else {
    return data
  }
}

export default defineEventHandler(async (event) => {
  // Parse and log the request body
  const body = await readBody(event)
  const { userId, levelId, coins } = body

  console.log('userId:', userId)
  console.log('levelId:', levelId)
  console.log('coins:', coins)

  // Validate input
  if (!userId || !levelId || typeof coins !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  try {
    // Execute the SELECT query using MariaDB's API (returns rows directly)
    const rows = await pool.execute(
      'SELECT stars FROM user_level_progress WHERE user_id = ? AND level_id = ?',
      [userId, levelId]
    )
    console.log('Full SELECT query result:', rows)

    // Verify that rows is an array
    if (!Array.isArray(rows)) {
      console.error('Unexpected SELECT query result format:', rows)
      throw createError({ statusCode: 500, statusMessage: 'Unexpected query result format' })
    }

    // If a record exists, update if coins are higher; otherwise, insert a new record
    if (rows.length > 0) {
      const existingCoins = rows[0].stars
      if (coins > existingCoins) {
        const updateResult = await pool.execute(
          'UPDATE user_level_progress SET stars = ? WHERE user_id = ? AND level_id = ?',
          [coins, userId, levelId]
        )
        // Convert BigInt values before returning
        return { success: true, updated: true, result: convertBigInt(updateResult) }
      } else {
        return { success: true, updated: false, message: 'No update necessary' }
      }
    } else {
      const insertResult = await pool.execute(
        'INSERT INTO user_level_progress (user_id, level_id, stars) VALUES (?, ?, ?)',
        [userId, levelId, coins]
      )
      // Convert BigInt values before returning
      return { success: true, inserted: true, result: convertBigInt(insertResult) }
    }
  } catch (error) {
    console.error('Database query error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Database error' })
  }
})
