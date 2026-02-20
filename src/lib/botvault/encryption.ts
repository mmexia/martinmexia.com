import crypto from 'node:crypto';

function getKekSecret(): Buffer {
  const secret = process.env.BOTVAULT_KEK_SECRET;
  if (!secret) throw new Error('BOTVAULT_KEK_SECRET environment variable is not set');
  return Buffer.from(secret, 'utf-8');
}

function deriveKEK(userId: string): Buffer {
  const salt = Buffer.from(userId, 'utf-8');
  const info = Buffer.from('botvault-kek', 'utf-8');
  return crypto.hkdfSync('sha256', getKekSecret(), salt, info, 32) as unknown as Buffer;
}

export function encryptCredential(
  userId: string,
  plaintext: string
): { encrypted_data: string; encrypted_dek: string; iv: string; auth_tag: string } {
  // Generate random DEK
  const dek = crypto.randomBytes(32);

  // Encrypt plaintext with DEK (AES-256-GCM)
  const dataIv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', dek, dataIv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf-8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Encrypt DEK with KEK (AES-256-GCM)
  const kek = Buffer.from(deriveKEK(userId));
  const dekIv = crypto.randomBytes(12);
  const dekCipher = crypto.createCipheriv('aes-256-gcm', kek, dekIv);
  const encDek = Buffer.concat([dekCipher.update(dek), dekCipher.final()]);
  const dekTag = dekCipher.getAuthTag();

  // Combine dekIv + encDek + dekTag
  const combinedDek = Buffer.concat([dekIv, encDek, dekTag]);

  return {
    encrypted_data: encrypted.toString('base64'),
    encrypted_dek: combinedDek.toString('base64'),
    iv: dataIv.toString('base64'),
    auth_tag: authTag.toString('base64'),
  };
}

export function decryptCredential(
  userId: string,
  encrypted_data: string,
  encrypted_dek: string,
  iv: string,
  auth_tag: string
): string {
  // Unwrap DEK
  const combinedDek = Buffer.from(encrypted_dek, 'base64');
  const dekIv = combinedDek.subarray(0, 12);
  const encDek = combinedDek.subarray(12, -16);
  const dekTag = combinedDek.subarray(-16);

  const kek = Buffer.from(deriveKEK(userId));
  const dekDecipher = crypto.createDecipheriv('aes-256-gcm', kek, dekIv);
  dekDecipher.setAuthTag(dekTag);
  const dek = Buffer.concat([dekDecipher.update(encDek), dekDecipher.final()]);

  // Decrypt data with DEK
  const dataIv = Buffer.from(iv, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', dek, dataIv);
  decipher.setAuthTag(Buffer.from(auth_tag, 'base64'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted_data, 'base64')), decipher.final()]);

  return decrypted.toString('utf-8');
}
