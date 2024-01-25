const { getRandomItemFromArray } = require("./helpers");
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
