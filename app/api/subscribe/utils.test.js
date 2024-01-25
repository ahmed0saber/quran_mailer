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
    it('should generate a correct link with provided headers and token', () => {
        const link = generateEmailVerificationLink({
            headers: {
                host: 'example.com',
                'x-forwarded-proto': 'https'
            },
            token: '123456'
        });
        expect(link).toBe('https://example.com/api/verify-email?token=123456');
    });

    it('should default to http and localhost when headers are not provided', () => {
        const link = generateEmailVerificationLink({ token: 'abc123' });
        expect(link).toBe('http://localhost:3000/api/verify-email?token=abc123');
    });

    it('should handle missing host in headers', () => {
        const link = generateEmailVerificationLink({
            headers: { 'x-forwarded-proto': 'https' },
            token: 'token123'
        });
        expect(link).toBe('https://localhost:3000/api/verify-email?token=token123');
    });

    it('should handle missing protocol in headers', () => {
        const link = generateEmailVerificationLink({
            headers: { host: 'example.com' },
            token: 'testtoken'
        });
        expect(link).toBe('http://example.com/api/verify-email?token=testtoken');
    });
});

describe('integration testing - should correctly generate random token then generate email verification link', () => {
    it('should generate a valid email verification link with a random token', () => {
        const token = generateRandomToken();

        const link = generateEmailVerificationLink({
            headers: { host: 'example.com', 'x-forwarded-proto': 'https' },
            token: token
        });

        const expectedPrefix = 'https://example.com/api/verify-email?token=';
        expect(link.startsWith(expectedPrefix)).toBeTruthy();
        expect(link.slice(expectedPrefix.length)).toBe(token);
    });
});
