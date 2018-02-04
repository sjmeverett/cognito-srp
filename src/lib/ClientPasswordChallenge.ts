import { ClientUser } from './UserPool';
import { BigInteger } from './BigInteger';
import {
  getBigInteger,
  calculateScramblingParameter,
  calculatePrivateKey
} from './util';
import { g, N, Nbytes, multiplierParameter } from './constants';
import { Session } from './Session';

export class ClientPasswordChallenge {
  private a: BigInteger;
  private A: Buffer;

  constructor(
    public poolname: string,
    public user: ClientUser,
    a: string | Buffer
  ) {
    this.a = getBigInteger(a);
  }

  calculateA() {
    if (!this.A) {
      this.A = g.modPow(this.a, N).toBuffer(Nbytes);
    }
    return this.A;
  }

  getSession(B: string, salt: string) {
    const Bint = new BigInteger(B, 16);

    if (Bint.compareTo(BigInteger.ZERO) <= 0 || Bint.compareTo(N) >= 0) {
      throw new Error('A should be between 0 and N exclusive');
    }

    const privateKey = calculatePrivateKey(this.poolname, this.user, salt);

    const scramblingParameter = calculateScramblingParameter(
      this.calculateA(),
      Buffer.from(B, 'hex')
    );

    const sessionKey = Bint.subtract(
      multiplierParameter.multiply(g.modPow(privateKey, N))
    )
      .modPow(this.a.add(scramblingParameter.multiply(privateKey)), N)
      .mod(N)
      .toBuffer(Nbytes);

    return new Session(
      this.poolname,
      this.user.username,
      sessionKey,
      scramblingParameter.toBuffer()
    );
  }
}
