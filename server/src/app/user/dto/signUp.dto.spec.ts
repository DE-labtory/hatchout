import { SignUpDto } from './signUp.dto';

describe('SignUpDto', () => {
  it('should be defined', () => {
    expect(new SignUpDto({address: 'address', message: 'message'}, 'signature')).toBeDefined();
  });
});
