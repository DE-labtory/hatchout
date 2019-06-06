import { JwtSecretRequestType } from '@nestjs/jwt';

export default {
    secretOrKeyProvider: (
        requestType: JwtSecretRequestType,
        tokenOrPayload: string | object | Buffer,
    ) => {
        switch (requestType) {
            case JwtSecretRequestType.SIGN:
                return 'privateKey';
            case JwtSecretRequestType.VERIFY:
                return 'publicKey';
            default:
                // retrieve secret dynamically
                return 'hard!to-guess_secret';
            }
        },
    signOptions: {
        expiresIn: 3600,
    },
};
