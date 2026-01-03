# OAuth Setup Guide for ChronoTask

## Issues Found and Fixed

I've identified and fixed the following issues in your OAuth configuration:

1. ✅ **Missing OAuth Scopes**: Added `openid email profile` scopes (required for basic Google sign-in)
2. ✅ **Missing NextAuth Configuration**: Added `NEXTAUTH_SECRET` to the config
3. ✅ **OAuth Parameters**: Added `prompt`, `access_type`, and `response_type` for better OAuth flow

## Environment Variables Setup

You need to add the following variables to your `.env` file:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### Step 1: Generate NEXTAUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### Step 2: Set up Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create or Select a Project**:
   - Click on the project dropdown at the top
   - Create a new project or select an existing one

3. **Enable Google+ API** (if not already enabled):
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google People API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type (unless you have a Google Workspace)
   - Fill in the required fields:
     - App name: `ChronoTask` (or your app name)
     - User support email: Your email
     - Developer contact email: Your email
   - Add scopes (click "Add or Remove Scopes"):
     - `openid`
     - `email`
     - `profile`
     - `https://www.googleapis.com/auth/drive.file`
   - Click "Save and Continue"

5. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "+ CREATE CREDENTIALS" > "OAuth client ID"
   - Application type: "Web application"
   - Name: `ChronoTask Web Client` (or any name)
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `http://localhost:3001` (if you use different ports)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - Add your production URL when deploying: `https://yourdomain.com/api/auth/callback/google`
   - Click "Create"

6. **Copy Credentials**:
   - You'll see a popup with your Client ID and Client Secret
   - Copy these values to your `.env` file

### Step 3: Update Your .env File

Open your `.env` file and add/update these values:

```bash
NEXTAUTH_SECRET=<paste-the-secret-from-step-1>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<paste-from-google-console>
GOOGLE_CLIENT_SECRET=<paste-from-google-console>
```

### Step 4: Restart Your Development Server

After updating the `.env` file, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Testing OAuth

1. Open your app at `http://localhost:3000`
2. Click the "Sign in with Google" button
3. You should be redirected to Google's OAuth consent screen
4. After authorizing, you should be redirected back to your app and signed in

## Common Issues and Solutions

### Issue: "Error: Configuration" or "There is a problem with the server configuration"
**Solution**: Make sure `NEXTAUTH_SECRET` is set in your `.env` file

### Issue: "redirect_uri_mismatch"
**Solution**: 
- Check that the redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Make sure there are no trailing slashes
- The protocol (http/https) must match exactly

### Issue: "invalid_client"
**Solution**: 
- Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Make sure there are no extra spaces or quotes in the `.env` file

### Issue: "access_denied" or scope errors
**Solution**: 
- Make sure you've added all required scopes in the Google Console OAuth consent screen
- Try revoking access at https://myaccount.google.com/permissions and sign in again

## Production Deployment

When deploying to production:

1. Update `NEXTAUTH_URL` to your production domain:
   ```bash
   NEXTAUTH_URL=https://yourdomain.com
   ```

2. Add your production URL to Google Console:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

3. Generate a new, secure `NEXTAUTH_SECRET` for production

## Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Check the terminal/server logs for detailed error information
3. Verify all environment variables are correctly set (no typos, extra spaces, or quotes)

