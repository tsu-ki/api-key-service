## Project Structure

```
project-root/
├── config/
│   └── firebase.js          # Firebase Admin SDK initialization
├── controllers/
│   └── apiKey.js            # Generate API key endpoint logic
├── middleware/
│   └── apiKeyAuth.js        # API key verification middleware
├── utils/
│   └── encryption.js        # Encryption/decryption helpers (DRY)
├── routes/
│   └── apiKey.js            # API key related route definitions
├── .env                     # Environment variables
├── index.js                 # Express server entry point
└── package.json
```


## Setup Secrets

1. Generate encryption secret (32 bytes):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
2. Generate JWT secret (16 bytes):
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```
3. Add to .env file:
JWT_SECRET=<output-from-second-command>
API_KEY_ENCRYPTION_SECRET=<output-from-first-command>
FIREBASE_SERVICE_ACCOUNT={"type":"service_account", ...}

