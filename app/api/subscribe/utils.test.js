const { generateRandomToken, generateEmailVerificationLink } = require("./utils");

describe('unit testing - generateRandomToken', () => {
    it('should return a string', () => {
        const token = generateRandomToken();
        expect(typeof token).toBe('string');
    });

    it('should return a string of 32 characters', () => {
        const token = generateRandomToken();
        expect(token).toHaveLength(32); // Since 16 bytes = 32 hex characters
    });

    it('should return a hexadecimal string', () => {
        const token = generateRandomToken();
        expect(token).toMatch(/^[0-9a-f]{32}$/i);
    });
});

describe('unit testing - generateEmailVerificationLink', () => {
    it('should generate a correct link with provided origin and token', () => {
        const link = generateEmailVerificationLink({
            origin: 'http://localhost:3000',
            token: '123456'
        });
        expect(link).toBe('http://localhost:3000/api/verify-email?token=123456');
    });
});

describe('integration testing - should correctly generate random token then generate email verification link', () => {
    it('should generate a valid email verification link with a random token', () => {
        const token = generateRandomToken();

        const link = generateEmailVerificationLink({
            origin: 'http://localhost:3000',
            token: token
        });

        const expectedPrefix = 'http://localhost:3000/api/verify-email?token=';
        expect(link.startsWith(expectedPrefix)).toBeTruthy();
        expect(link.slice(expectedPrefix.length)).toBe(token);
    });
});
