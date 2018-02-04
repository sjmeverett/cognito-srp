import * as crypto from 'crypto';
import { HASH_TYPE, padHex } from './util';
import { infoBits } from './constants';

export class Session {
  private hkdf: Buffer;
  private key: Buffer;

  constructor(
    poolname: string,
    username: string,
    key: Buffer,
    scramblingParameter: Buffer
  );
  constructor(poolname: string, username: string, hkdf: string);
  constructor(
    private poolname: string,
    private username: string,
    keyOrHkdf: Buffer | string,
    private scramblingParameter?: Buffer
  ) {
    if (keyOrHkdf instanceof Buffer) {
      this.key = keyOrHkdf;
      this.hkdf = this.calculateHkdf();
    } else {
      this.hkdf = Buffer.from(keyOrHkdf, 'hex');
    }
  }

  calculateSignature(secretBlock: string, timestamp: string) {
    return crypto
      .createHmac(HASH_TYPE, this.hkdf)
      .update(this.poolname)
      .update(this.username)
      .update(Buffer.from(secretBlock, 'base64'))
      .update(timestamp)
      .digest('base64');
  }

  getHkdf() {
    return this.hkdf.toString('hex');
  }

  private calculateHkdf() {
    const prk = crypto
      .createHmac(
        HASH_TYPE,
        Buffer.from(padHex(this.scramblingParameter), 'hex')
      )
      .update(Buffer.from(padHex(this.key), 'hex'))
      .digest();

    const hmac = crypto
      .createHmac(HASH_TYPE, prk)
      .update(infoBits)
      .digest();

    return hmac.slice(0, 16);
  }
}
