import { ServerPasswordChallenge } from '../lib';
import { secret, poolname, serverUser, publicKey } from './constants';

describe('ServerPasswordChallenge', () => {
  let challenge: ServerPasswordChallenge;

  beforeAll(() => {
    challenge = new ServerPasswordChallenge(poolname, serverUser, secret);
  });

  it('should calculate A', () => {
    const B = challenge.calculateB();
    expect(B).toMatchSnapshot();
  });

  it('should get a session', () => {
    const session = challenge.getSession(publicKey);
    expect(session.getHkdf()).toMatchSnapshot();
  });
});
