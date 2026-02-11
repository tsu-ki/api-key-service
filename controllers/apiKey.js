import { db } from '../config/firebase.js';
import { generateRawKey, encrypt } from '../utils/encryption.js';

/**
 * POST /api-key/generate
 * Body: { accountId: string }
 * Auth: Admin JWT required
 *
 * generates API key, stores in both accounts/{accountId}
 * and api_keys/{accountId} atomically via batch write
 * returns raw key once + encrypted key for client localStorage
 */
export const generateApiKey = async (req, res, next) => {
  try {
    const { accountId } = req.body;
    if (!accountId) return res.status(400).json({ message: 'accountId required', success: false });

    const accountRef = db.collection('accounts').doc(accountId);
    const accountSnap = await accountRef.get();
    if (!accountSnap.exists) return res.status(404).json({ message: 'Account not found', success: false });

    const rawKey = generateRawKey();
    const encryptedKey = encrypt(rawKey);

    const batch = db.batch();
    batch.update(accountRef, { apiKey: encryptedKey });
    batch.set(
      db.collection('api_keys').doc(accountId),
      { accountId, apiKey: encryptedKey, createdAt: new Date().toISOString() }
    );
    await batch.commit();

    res.status(201).json({
      apiKey: rawKey,
      encryptedApiKey: encryptedKey,
      message: 'API key generated. Store the raw key securely.',
      success: true
    });
  } catch (err) {
    next(err);
  }
};
