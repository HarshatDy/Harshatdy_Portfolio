# Gmail OAuth2 Setup

The newsletter and verification emails are sent via the Gmail API using OAuth2. This is a one-time setup per Google account.

## Prerequisites

- A Google account to send emails from
- A Google Cloud project (free)

## Steps

### 1. Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **New Project**, give it a name (e.g. `portfolio-mailer`)
3. Select the project

### 2. Enable the Gmail API

1. In the left menu go to **APIs & Services → Library**
2. Search for **Gmail API** and click **Enable**

### 3. Create OAuth2 credentials

1. Go to **APIs & Services → Credentials**
2. Click **+ Create Credentials → OAuth client ID**
3. If prompted, configure the consent screen first:
   - User type: **External**
   - Fill in app name and your email
   - No scopes needed on the form — the script handles it
   - Add your own email as a **Test user**
4. Back in Create Credentials:
   - Application type: **Desktop app**
   - Give it a name, click **Create**
5. Copy the **Client ID** and **Client Secret**

### 4. Set credentials and run the auth script

```bash
export GMAIL_CLIENT_ID="your_client_id.apps.googleusercontent.com"
export GMAIL_CLIENT_SECRET="GOCSPX-..."

node scripts/gmail-auth.js
```

The script will print an authorization URL. Open it in your browser, authorize with your Google account, then paste the code back into the terminal.

It will print:
```
GMAIL_REFRESH_TOKEN=1//...
```

### 5. Add to .env.local

```env
GMAIL_CLIENT_ID=your_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...
GMAIL_REFRESH_TOKEN=1//...
GMAIL_SENDER_EMAIL=youremail@gmail.com
```

## Token expiry

The refresh token does **not** expire unless:
- You haven't used it for **6 months** (Google auto-revokes idle tokens for apps in test mode)
- You revoke it manually at [myaccount.google.com/permissions](https://myaccount.google.com/permissions)
- You re-configure the OAuth credentials in Google Cloud Console

If you get `invalid_grant: Bad Request` errors, re-run `node scripts/gmail-auth.js` to get a fresh token.

## Publishing the app (optional)

While the app is in **test mode**, only users listed as Test Users can authorize it. For production use you can publish the OAuth app — go to **APIs & Services → OAuth consent screen → Publish App**. For a personal mailer sending to yourself/subscribers, test mode with test users added is sufficient.
