import { NextResponse } from 'next/server'

export function validateCronSecret(request: Request): boolean {
  const auth = request.headers.get('Authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return auth === `Bearer ${secret}`
}

export function cronUnauthorized(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
