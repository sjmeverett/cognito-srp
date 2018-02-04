import { Session } from '../lib';
import {
  poolname,
  clientUser,
  sessionKey,
  scramblingParameter,
  hkdf
} from './constants';

describe('Session', () => {
  it('should be constructable from session key and scrambling parameter', () => {
    const session = new Session(
      poolname,
      clientUser.username,
      Buffer.from(sessionKey, 'hex'),
      Buffer.from(scramblingParameter, 'hex')
    );
    expect(session.getHkdf()).toMatchSnapshot();
    expect(session.calculateSignature('secret', 'timestamp')).toMatchSnapshot();
  });

  it('should be constructable from hkdf', () => {
    const session = new Session(poolname, clientUser.username, hkdf);
    expect(session.getHkdf()).toMatchSnapshot();
    expect(session.calculateSignature('secret', 'timestamp')).toMatchSnapshot();
  });
});
