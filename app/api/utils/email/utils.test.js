const { generateEmailVerificationLink } = require("./utils");

describe('unit testing - generateEmailVerificationLink', () => {
    it('should generate a correct link with provided origin and token', () => {
        const link = generateEmailVerificationLink({
            origin: 'http://localhost:3000',
            token: '123456'
        });
        expect(link).toBe('http://localhost:3000/api/verify-email?token=123456');
    });
});