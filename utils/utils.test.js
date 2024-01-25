const { getParamFromUrl } = require('./url');
const { formatDate } = require('./date');

describe('unit testing - getParamFromUrl', () => {
    it('should return null if query parameter doesn\'t exist', () => {
        const url = 'http://example.com';
        const param = 'page';
        expect(getParamFromUrl({ param, url })).toBeNull();
    });

    it('should return the value of the specified query parameter', () => {
        const url = 'http://example.com?page=3';
        const param = 'page';
        expect(getParamFromUrl({ param, url })).toBe('3');
    });
});

describe('unit testing - formatDate', () => {
    it('should correctly format a standard date', () => {
        const date = new Date('2024-01-24T12:34:56');
        expect(formatDate(date)).toBe('2024-01-24 12:34:56');
    });

    it('should pad single-digit months, days, hours, minutes, and seconds', () => {
        const date = new Date('2024-02-03T04:05:06');
        expect(formatDate(date)).toBe('2024-02-03 04:05:06');
    });

    it('should handle leap year dates', () => {
        const date = new Date('2024-02-29T23:59:59');
        expect(formatDate(date)).toBe('2024-02-29 23:59:59');
    });
});
