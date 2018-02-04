import { UserPool } from '../lib';
import { poolname, clientUser } from './constants';

describe('integration', () => {
  it('works together', async () => {
    const userPool = new UserPool(poolname);

    const serverUser = await userPool.createUser(clientUser);
    const client = await userPool.getClientChallenge(clientUser);
    const server = await userPool.getServerChallenge(serverUser);

    const A = client.calculateA().toString('hex');
    const B = server.calculateB().toString('hex');

    const clientSignature = client
      .getSession(B, serverUser.salt)
      .calculateSignature('secret', 'timestamp');

    const serverSignature = server
      .getSession(A)
      .calculateSignature('secret', 'timestamp');

    expect(clientSignature).toEqual(serverSignature);
  });
});
