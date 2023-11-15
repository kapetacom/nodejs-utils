import { describe, test, expect } from '@jest/globals';
import { createVersion, parseVersion } from '../src/Version';

describe('Version', () => {
    test('Can parse versions', async () => {
        expect(parseVersion('1.2.3').toObject()).toEqual({
            major: 1,
            minor: 2,
            patch: 3,
        });

        expect(parseVersion('1.2.3-rc').toObject()).toEqual({
            major: 1,
            minor: 2,
            patch: 3,
            preRelease: 'rc',
        });

        expect(parseVersion('1.2.3-rc.1').toObject()).toEqual({
            major: 1,
            minor: 2,
            patch: 3,
            preRelease: 'rc',
            preReleaseIteration: 1,
        });

        expect(parseVersion('1.2.3+ABCD').toObject()).toEqual({
            major: 1,
            minor: 2,
            patch: 3,
            build: 'ABCD',
        });

        expect(parseVersion('1.2.3+ABCD.2').toObject()).toEqual({
            major: 1,
            minor: 2,
            patch: 3,
            build: 'ABCD',
            buildIteration: 2,
        });

        expect(parseVersion('1.2.3-rc+ABCD.2').toObject()).toEqual({
            major: 1,
            minor: 2,
            patch: 3,
            preRelease: 'rc',
            build: 'ABCD',
            buildIteration: 2,
        });

        expect(parseVersion('1.2.3-rc.3+ABCD.2').toObject()).toEqual({
            major: 1,
            minor: 2,
            patch: 3,
            preRelease: 'rc',
            preReleaseIteration: 3,
            build: 'ABCD',
            buildIteration: 2,
        });
    });

    test('Can compare versions', async () => {
        expect(parseVersion('1.2.3').compareTo(parseVersion('1.2.3'))).toBe(0);

        expect(parseVersion('1.2.3').equals(parseVersion('1.2.3'))).toBe(true);

        expect(parseVersion('1.2.3').isSmallerThan(parseVersion('2.2.3'))).toBe(true);

        expect(parseVersion('1.2.3').isGreaterThan(parseVersion('1.2.3-rc'))).toBe(true);

        expect(parseVersion('1.2.3-rc.1').isSmallerThan(parseVersion('1.2.3-rc.2'))).toBe(true);

        expect(parseVersion('1.2.3-rc.2+ABC').isSmallerThan(parseVersion('1.2.3-rc.2'))).toBe(true);

        expect(parseVersion('1.2.3-rc.2+ABC.2').isGreaterThan(parseVersion('1.2.3-rc.2+ABC'))).toBe(true);

        expect(parseVersion('1.2.3-rc.2+ABC.3').isGreaterThan(parseVersion('1.2.3-rc.2+ABC.2'))).toBe(true);

        expect(parseVersion('1.2.3+ABC.3').isGreaterThan(parseVersion('1.2.3+ABC.2'))).toBe(true);
    });

    test('Can create versions', async () => {
        expect(createVersion(1, 2, 3).toString()).toBe('1.2.3');

        expect(createVersion(1, 2, 3, 'rc').toString()).toBe('1.2.3-rc');
        expect(createVersion(1, 2, 3, 'rc.2').toString()).toBe('1.2.3-rc.2');

        expect(createVersion(1, 2, 3, undefined, 'ABC').toString()).toBe('1.2.3+ABC');
        expect(createVersion(1, 2, 3, undefined, 'ABC.2').toString()).toBe('1.2.3+ABC.2');

        expect(createVersion(1, 2, 3, 'rc', 'ABC').toString()).toBe('1.2.3-rc+ABC');
        expect(createVersion(1, 2, 3, 'rc.2', 'ABC.2').toString()).toBe('1.2.3-rc.2+ABC.2');
    });
});
