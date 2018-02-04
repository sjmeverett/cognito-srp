import { randomBytes, calculatePrivateKey } from './util';
import { N, Nbytes, g } from './constants';
import { ServerPasswordChallenge } from './ServerPasswordChallenge';
import { ClientPasswordChallenge } from './ClientPasswordChallenge';

export interface ServerUser {
  username: string;
  salt: string;
  verifier: string;
}

export interface ClientUser {
  username: string;
  password: string;
}

export class UserPool {
  constructor(private poolname: string) {}

  async createUser(user: ClientUser, salt?: string): Promise<ServerUser> {
    if (!salt) {
      salt = (await randomBytes(16)).toString('hex');
    }

    const privateKey = calculatePrivateKey(this.poolname, user, salt);

    const verifier = g
      .modPow(privateKey, N)
      .toBuffer(Nbytes)
      .toString('hex');

    return { username: user.username, salt, verifier };
  }

  async getServerChallenge(user: ServerUser) {
    const b = await randomBytes();
    return new ServerPasswordChallenge(this.poolname, user, b);
  }

  async getClientChallenge(user: ClientUser) {
    const a = await randomBytes();
    return new ClientPasswordChallenge(this.poolname, user, a);
  }
}
