import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import apiKeyRoutes from './routes/apiKey.js';
import { verifyApiKey } from './middleware/apiKeyAuth.js';

const app = express();
app.use(express.json());

/**
 * JWT verification middleware.
 * Extracts accountId from token and attaches to req.user.
 * Replace or extend this with your own auth logic.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token required', success: false });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token', success: false });
  }
};

/**
 * Admin-only guard. Checks req.user.role === 'admin'.
 * Adjust role values to match your system.
 */
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required', success: false });
  }
  next();
};

// Admin-only: generate API key
app.use('/api-key', verifyToken, requireAdmin, apiKeyRoutes);

// All /api/* routes: require JWT + valid API key + credits >= 100
app.use('/api', verifyToken, verifyApiKey);

// Example protected route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Access granted', account: req.account.accountId, success: true });
});

app.get('/', (req, res) => {
  res.json({ message: 'API Key Service running', success: true });
});

// Error handler
app.use((err, req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error', success: false });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
