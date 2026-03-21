/**
 * ONE-TIME SCRIPT: Generate Gmail OAuth2 refresh token
 *
 * Run once locally to get your refresh token, then store it in .env.local
 *
 * Setup:
 * 1. Go to console.cloud.google.com → New project → Enable Gmail API
 * 2. Create OAuth2 credentials (Desktop App type)
 * 3. Set these in your shell before running:
 *      export GMAIL_CLIENT_ID="your_client_id"
 *      export GMAIL_CLIENT_SECRET="your_client_secret"
 * 4. Run: node scripts/gmail-auth.js
 * 5. Visit the printed URL, authorize, paste the code back
 * 6. Copy the printed refresh token to your .env.local
 *
 * Usage: node scripts/gmail-auth.js
 */
require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis')
const readline = require('readline')

console.log(process.env.GMAIL_CLIENT_ID)
console.log(process.env.GMAIL_CLIENT_SECRET)

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob', // Desktop app redirect
)



const SCOPES = ['https://www.googleapis.com/auth/gmail.send']

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent', // force refresh token to be returned
})

console.log('\n=== Gmail OAuth2 Token Generator ===\n')
console.log('1. Visit this URL in your browser:\n')
console.log(authUrl)
console.log('\n2. Authorize the app and copy the authorization code.\n')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

rl.question('3. Paste the authorization code here: ', async (code) => {
  rl.close()
  try {
    const { tokens } = await oauth2Client.getToken(code.trim())
    console.log('\n=== SUCCESS ===\n')
    console.log('Add these to your .env.local:\n')
    console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`)
    console.log('\nDone! You can delete this script now if you want.')
  } catch (err) {
    console.error('Error getting token:', err.message)
    process.exit(1)
  }
})
