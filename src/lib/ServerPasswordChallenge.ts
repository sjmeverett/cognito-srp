import { calculateScramblingParameter, getBigInteger, padHex } from './util';
import { BigInteger } from './BigInteger';
import { multiplierParameter, g, N, Nbytes } from './constants';
import { Session } from './Session';
import { ServerUser } from './UserPool';

export class ServerPasswordChallenge {
  private b: BigInteger;
  private B: Buffer;
  private verifier: BigInteger;

  constructor(
    public poolname: string,
    public user: ServerUser,
    b: string | Buffer
  ) {
    this.verifier = new BigInteger(user.verifier, 16);
    this.b = getBigInteger(b);
  }

  calculateB() {
    if (!this.B) {
      this.B = multiplierParameter
        .multiply(this.verifier)
        .add(g.modPow(this.b, N))
        .mod(N)
        .toBuffer(Nbytes);
    }
    return this.B;
  }

  getSession(A: string) {
    A = padHex(A);
    const Aint = new BigInteger(A, 16);

    if (Aint.compareTo(BigInteger.ZERO) <= 0 || Aint.compareTo(N) >= 0) {
      throw new Error('A should be between 0 and N exclusive');
    }

    const scramblingParameter = calculateScramblingParameter(
      Buffer.from(A, 'hex'),
      this.calculateB()
    );

    const sessionKey = Aint.multiply(
      this.verifier.modPow(scramblingParameter, N)
    )
      .modPow(this.b, N)
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
