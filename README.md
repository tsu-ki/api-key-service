project-root/
├── config/
│   └── firebase.js          # Firebase Admin SDK init
├── controllers/
│   └── apiKey.js             # Generate API key endpoint
├── middleware/
│   └── apiKeyAuth.js         # Verify API key middleware
├── utils/
│   └── encryption.js         # Encrypt/decrypt helpers (DRY)
├── routes/
│   └── apiKey.js             # Route definitions
├── .env
├── index.js                  # Express entry point
└── package.json

# generate encryption secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# generate a JWT secret
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

Paste the outputs into .env:
JWT_SECRET=<output-from-second-command>
FIREBASE_SERVICE_ACCOUNT=<service-account-json>
API_KEY_ENCRYPTION_SECRET=<output-from-first-command>
