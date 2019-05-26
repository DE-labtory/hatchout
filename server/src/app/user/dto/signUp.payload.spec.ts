import { SignUpPayload } from './signUp.payload';

describe('SignUpPayload', () => {
  it('should be defined', () => {
    expect(new SignUpPayload({address: 'address', message: 'message'}, 'signature')).toBeDefined();
  });
});
