const { generateEmailVerificationLink } = require("./email/utils");
const { getRandomItemFromArray, generateRandomToken } = require("./helpers");
const { startMeasuringTime } = require("./measure-time");

describe('unit testing - getRandomItemFromArray', () => {
    it('should return an item from the array', () => {
        const array = [1, 2, 3, 4, 5];
        const item = getRandomItemFromArray(array);
        expect(array).toContain(item);
    });
});

describe('integration testing - get random item from verses array', () => {
    it('should return a random verse from the verses array', () => {
        const { verses } = require('../data/verses');
        const item = getRandomItemFromArray(verses);
        expect(verses).toContain(item);
    });
});

describe('unit testing - startMeasuringTime', () => {
    it('should return a function', () => {
        const measureTime = startMeasuringTime();
        expect(typeof measureTime).toBe('function');
    });

    it('should return a number when the returned function is called', () => {
        const measureTime = startMeasuringTime();
        const elapsed = measureTime();
        expect(typeof elapsed).toBe('bigint');
    });

    it('should measure time in milliseconds', async () => {
        const measureTime = startMeasuringTime();
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        await delay(500);

        const elapsed = measureTime();
        expect(Number(elapsed)).toBeGreaterThanOrEqual(500);
        expect(Number(elapsed)).toBeLessThan(600); // Allowing some margin for timing inconsistencies
    });
});

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
