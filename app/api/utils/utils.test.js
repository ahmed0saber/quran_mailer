const { getRandomItemFromArray } = require("./helpers");

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
