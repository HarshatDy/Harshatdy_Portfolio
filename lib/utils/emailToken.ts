import crypto from 'crypto'

/** Generate a secure random hex token (64 chars = 256 bits) */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/** Hash a token with SHA256 before storing in DB */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/** Constant-time comparison to prevent timing attacks */
export function compareTokens(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

/** Returns an expiry timestamp 24 hours from now */
export function tokenExpiry(): string {
  const expiry = new Date()
  expiry.setHours(expiry.getHours() + 24)
  return expiry.toISOString()
}
