/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

interface KapetaURIData {
    protocol: string;
    handle: string;
    name: string;
    version: string;
    fullName: string;
    id: string;
}

export class KapetaURI {
    private readonly uri: string;

    private data: KapetaURIData;
    /**
     *
     * @param {string} uri
     */
    constructor(uri) {
        this.uri = uri;
        this.data = this.parse();
    }

    get protocol() {
        return this.data.protocol ?? 'kapeta';
    }

    set protocol(protocol) {
        this.data.protocol = protocol;
    }

    get name() {
        return this.data.name;
    }

    set name(name) {
        this.data.name = name;
    }

    get handle() {
        return this.data.handle;
    }

    set handle(handle) {
        this.data.handle = handle;
    }

    get version() {
        return this.data.version;
    }

    set version(version) {
        this.data.version = version;
    }

    get id() {
        return `${this.handle}/${this.name}:${this.version}`.toLowerCase();
    }

    get fullName() {
        return `${this.handle}/${this.name}`.toLowerCase();
    }

    toNormalizedString() {
        if (!this.version) {
            return `${this.protocol}://${this.fullName}`.toLowerCase();
        }

        return `${this.protocol}://${this.id}`.toLowerCase();
    }

    /**
     *
     * @param {KapetaURI} otherUri
     */
    compare(otherUri) {
        return this.id.localeCompare(otherUri.id);
    }

    /**
     *
     * @param {KapetaURI} otherUri
     */
    equals(otherUri) {
        return this.id === otherUri.id;
    }

    toString() {
        return this.version ? this.id : this.fullName;
    }

    private parse(): KapetaURIData {
        const uri = this.uri;
        const rx =
            /^(?:([^\/\s:]+):\/\/)?([^\/\s:]+)\/([^\s:\/]+)(?::(\S+))?$/i;

        if (!rx.test(uri)) {
            throw new Error('Invalid Kapeta uri: ' + uri);
        }

        const match = rx.exec(uri);

        if (!match) {
            return {
                protocol: '',
                fullName: '',
                handle: '',
                name: '',
                version: '',
                id: '',
            };
        }

        let [, protocol, handle, name, version] = match;

        if (!version) {
            version = '';
        }

        return {
            protocol,
            handle,
            name,
            version,
            fullName: `${handle}/${name}`,
            id: `${handle}/${name}:${version}`,
        };
    }
}

export const createKapetaUri = (
    handle: string,
    name: string,
    version?: string
): KapetaURI => {
    const uri = `kapeta://${handle}/${name}${version ? ':' + version : ''}`;
    return parseKapetaUri(uri);
};

export const parseKapetaUri = (uri): KapetaURI => {
    return new KapetaURI(uri);
};

/**
 * Normalize a Kapeta URI to a canonical form
 *
 * Useful for comparing URIs or using them as keys in a map.
 */
export function normalizeKapetaUri(uri: string): string {
    if (!uri) {
        return '';
    }

    return parseKapetaUri(uri).toNormalizedString();
}
