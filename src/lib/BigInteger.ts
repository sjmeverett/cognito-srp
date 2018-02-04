import { BigInteger as _BigInteger } from 'jsbn';

declare module 'jsbn' {
  export interface BigInteger {
    toBuffer(length?: number): Buffer;
  }
}

_BigInteger.prototype.toBuffer = function(length?: number) {
  let str = this.toString(16);

  if (length) {
    str = str.padStart(length * 2, '0');
  } else if (str.length % 2) {
    str = '0' + str;
  }

  return Buffer.from(str, 'hex');
};

export class BigInteger extends _BigInteger {
  static fromBuffer(buffer: Buffer) {
    return new BigInteger(buffer.toString('hex'), 16);
  }
}
