import * as crypto from 'crypto';
import { BigInteger } from './BigInteger';
import { ClientUser } from './UserPool';

export const HASH_TYPE = 'sha256';

export function getHash(data: Buffer | string, length?: number) {
  const hash = crypto
    .createHash(HASH_TYPE)
    .update(data)
    .digest('hex');

  return length ? hash.padStart(length * 2, '0') : hash;
}

export function padHex(data: string | Buffer) {
  const hex = data instanceof Buffer ? data.toString('hex') : data;

  if (hex.length % 2) {
    return '0' + hex;
  } else if ('89ABCDEFabcdef'.includes(hex[0])) {
    return '00' + hex;
  } else {
    return hex;
  }
}

export function randomBytes(size = 32) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.randomBytes(size, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export function calculateScramblingParameter(A: Buffer, B: Buffer) {
  const hash = crypto
    .createHash(HASH_TYPE)
    .update(Buffer.from(padHex(A), 'hex'))
    .update(Buffer.from(padHex(B), 'hex'))
    .digest();

  return BigInteger.fromBuffer(hash);
}

export function calculatePrivateKey(
  poolname: string,
  user: ClientUser,
  salt: string
) {
  const hash = getHash(`${poolname}${user.username}:${user.password}`, 32);
  const buffer = Buffer.from(padHex(salt) + hash, 'hex');
  return new BigInteger(getHash(buffer, 32), 16);
}

export function getBigInteger(data: string | Buffer) {
  if (data instanceof Buffer) {
    return BigInteger.fromBuffer(data);
  } else {
    return new BigInteger(data, 16);
  }
}
