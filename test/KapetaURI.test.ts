import { describe, test, expect } from '@jest/globals';
import { createKapetaUri, normalizeKapetaUri, parseKapetaUri } from '../src/KapetaURI';

describe('KapetaURI', () => {
    test('Can parse kapeta uri', async () => {
        expect(parseKapetaUri('kapeta://myhandle/myname:1.2.3').toObject()).toEqual({
            fullName: 'myhandle/myname',
            handle: 'myhandle',
            id: 'myhandle/myname:1.2.3',
            name: 'myname',
            protocol: 'kapeta',
            version: '1.2.3',
        });

        expect(parseKapetaUri('myhandle/myname:1.2.3').toObject()).toEqual({
            fullName: 'myhandle/myname',
            handle: 'myhandle',
            id: 'myhandle/myname:1.2.3',
            name: 'myname',
            protocol: 'kapeta',
            version: '1.2.3',
        });

        expect(parseKapetaUri('other://myhandle/myname:1.2.3').toObject()).toEqual({
            fullName: 'myhandle/myname',
            handle: 'myhandle',
            id: 'myhandle/myname:1.2.3',
            name: 'myname',
            protocol: 'other',
            version: '1.2.3',
        });

        expect(parseKapetaUri('myhandle/myname').toObject()).toEqual({
            fullName: 'myhandle/myname',
            handle: 'myhandle',
            id: 'myhandle/myname',
            name: 'myname',
            protocol: 'kapeta',
            version: '',
        });
    });

    test('Can normalize uris', async () => {
        expect(normalizeKapetaUri('myhandle/myname')).toBe('kapeta://myhandle/myname');
        expect(normalizeKapetaUri('myhandle/myname:1.2.3')).toBe('kapeta://myhandle/myname:1.2.3');

        expect(normalizeKapetaUri('MyHandle/MyName:1.2.3')).toBe('kapeta://myhandle/myname:1.2.3');
    });

    test('Can create uris', async () => {
        expect(createKapetaUri('myhandle', 'myname').toNormalizedString()).toBe('kapeta://myhandle/myname');
        expect(createKapetaUri('myhandle', 'myname', '1.2.3').toNormalizedString()).toBe(
            'kapeta://myhandle/myname:1.2.3'
        );
    });
});
