# 🚀 Quick Reference - Google OAuth Verification

## URLs to Use in Google Console

### OAuth Consent Screen Configuration

| Field | URL |
|-------|-----|
| **Application home page** | `https://chrono-task-kappa.vercel.app/about` |
| **Privacy policy link** | `https://chrono-task-kappa.vercel.app/privacy-policy` |
| **Terms of service link** | `https://chrono-task-kappa.vercel.app/terms-and-service` |

### OAuth Client Redirect URIs

```
https://chrono-task-kappa.vercel.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

### Authorized JavaScript Origins

```
https://chrono-task-kappa.vercel.app
http://localhost:3000
```

---

## Scopes to Request

1. `openid` (automatically included)
2. `email` (automatically included)
3. `profile` (automatically included)
4. `https://www.googleapis.com/auth/drive.file`

---

## Contact Email

**All fields**: `touhid.ru66@gmail.com`

---

## Quick Scope Justification

**For drive.file scope**:
> ChronoTask uses the drive.file scope to save user task data to their Google Drive for optional cross-device synchronization. This scope only allows access to files created by ChronoTask and cannot read or modify any other files in the user's Drive. Sync is completely optional and users can revoke access at any time.

---

## ✅ What's Been Created

- ✅ `/about` - Professional landing page with app description
- ✅ `/privacy-policy` - Comprehensive privacy policy with Google API details
- ✅ `/terms-and-service` - Terms of service
- ✅ All pages accessible without login
- ✅ Privacy policy links on all pages
- ✅ Detailed Google data usage explanation

---

## 📝 Next Steps

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Update all URLs with the ones above
3. Add the drive.file scope with justification
4. Click "Prepare for verification"
5. Submit for verification

---

See `GOOGLE_OAUTH_VERIFICATION_GUIDE.md` for detailed instructions.
