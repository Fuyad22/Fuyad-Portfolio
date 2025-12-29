import { NextRequest, NextResponse } from 'next/server'
import pool from '../../../lib/neon'

// const dataPath = path.join(process.cwd(), 'data', 'portfolio.json')

export async function GET() {
  const { rows } = await pool.query('SELECT data FROM portfolio LIMIT 1')
  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: 'No data found' }), { status: 404 })
  }
  return new Response(JSON.stringify(rows[0].data), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  await pool.query('UPDATE portfolio SET data = $1', [body])
  return new Response(JSON.stringify({ success: true }))
}