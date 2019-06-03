import {SignUpDto} from './signUp.dto';

describe('SignUpPayload', () => {
  it('should be defined', () => {
    expect(new SignUpDto({address: 'address', message: 'message'}, 'signature')).toBeDefined();
  });
});
