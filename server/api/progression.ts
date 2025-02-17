import { defineEventHandler, readBody, createError } from 'h3'
import pool from '~/server/db'

/**
 * Recursively convert BigInt values in a data structure to strings.
 * Change to Number(val) if you are sure the values can be safely converted.
 *
 * @param data - The data to convert.
 * @returns The converted data.
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
  // Parse the request body.
  const body = await readBody(event)
  const { userId, levelId, coins } = body

  console.log('userId:', userId)
  console.log('levelId:', levelId)
  console.log('coins:', coins)

  // Validate input data.
  if (!userId || !levelId || typeof coins !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  try {
    // Retrieve existing progress record for the user and level.
    const rows = await pool.execute(
      'SELECT stars FROM user_level_progress WHERE user_id = ? AND level_id = ?',
      [userId, levelId]
    )
    console.log('Full SELECT query result:', rows)

    // Ensure the query returned an array.
    if (!Array.isArray(rows)) {
      console.error('Unexpected SELECT query result format:', rows)
      throw createError({ statusCode: 500, statusMessage: 'Unexpected query result format' })
    }

    // Update if record exists and new coins are higher, else insert a new record.
    if (rows.length > 0) {
      const existingCoins = rows[0].stars
      if (coins > existingCoins) {
        const updateResult = await pool.execute(
          'UPDATE user_level_progress SET stars = ? WHERE user_id = ? AND level_id = ?',
          [coins, userId, levelId]
        )
        return { success: true, updated: true, result: convertBigInt(updateResult) }
      } else {
        return { success: true, updated: false, message: 'No update necessary' }
      }
    } else {
      const insertResult = await pool.execute(
        'INSERT INTO user_level_progress (user_id, level_id, stars) VALUES (?, ?, ?)',
        [userId, levelId, coins]
      )
      return { success: true, inserted: true, result: convertBigInt(insertResult) }
    }
  } catch (error) {
    console.error('Database query error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Database error' })
  }
})
