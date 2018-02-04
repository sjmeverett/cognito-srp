import {
  UserPool,
  ServerPasswordChallenge,
  ClientPasswordChallenge
} from '../lib';

import { salt, poolname, clientUser, serverUser } from './constants';

describe('UserPool', () => {
  let pool: UserPool;

  beforeAll(() => {
    pool = new UserPool(poolname);
  });

  it('should create a user', async () => {
    const user = await pool.createUser(clientUser, salt);
    expect(user).toMatchSnapshot();
  });

  it('should provide server challenges', async () => {
    const challenge = await pool.getServerChallenge(serverUser);
    expect(challenge).toBeInstanceOf(ServerPasswordChallenge);
  });

  it('should provide client challenges', async () => {
    const challenge = await pool.getClientChallenge(clientUser);
    expect(challenge).toBeInstanceOf(ClientPasswordChallenge);
  });
});
