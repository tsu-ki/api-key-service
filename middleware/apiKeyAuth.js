import { db } from '../config/firebase.js';
import { decrypt } from '../utils/encryption.js';

const MIN_CREDITS = 100;

/**
validates X-API-Key header against Firestore
flow: extract key -> lookup api_keys/{accountId} -> decrypt -> compare
       -> verify accounts/{accountId} ownership -> check credits >= 100
@used_in routes that start with /api/
*/
export const verifyApiKey = async (req, res, next) => {
  const providedKey = req.headers['x-api-key'];
  if (!providedKey) return res.status(401).json({ message: 'API key required', success: false });

  const accountId = req.user?.accountId;
  if (!accountId) return res.status(401).json({ message: 'Authentication required', success: false });

  try {
    const [apiKeySnap, accountSnap] = await Promise.all([
      db.collection('api_keys').doc(accountId).get(),
      db.collection('accounts').doc(accountId).get()
    ]);

    const storedKey = apiKeySnap.exists && apiKeySnap.data().apiKey;
    if (!storedKey) return res.status(401).json({ message: 'No API key found', success: false });

    if (!accountSnap.exists) return res.status(401).json({ message: 'Unauthorized', success: false });

    const decryptedKey = safeDecrypt(storedKey);
    if (!decryptedKey || decryptedKey !== providedKey) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const accountData = accountSnap.data();

    // stored key in accounts must match api_keys entry
    if (accountData.apiKey !== storedKey) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    // credits gate
    if ((accountData.credits ?? 0) < MIN_CREDITS) {
      return res.status(403).json({ message: 'Insufficient credits', success: false });
    }

    req.account = accountData;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

function safeDecrypt(encryptedText) {
  try {
    return decrypt(encryptedText);
  } catch {
    return null;
  }
}
