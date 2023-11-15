export class Version {
    private readonly version: string;

    private _tag?: string;

    private _major?: number;

    private _minor?: number;

    private _patch?: number;

    private _preRelease?: string;

    private _preReleaseIteration?: number;

    private _build?: string;

    private _buildIteration?: number;

    constructor(version: string) {
        this.version = version;
        this.parse();
    }

    private splitString(str: string): [string, string, string] {
        const parts = str.split('.');
        const major = parts.shift() ?? '';
        const minor = parts.shift() ?? '';
        const last = parts.join('.');
        return [major, minor, last];
    }

    private parse() {
        if (this.version === 'local') {
            this._tag = 'local';
            return;
        }

        let [major, minor, last] = this.splitString(this.version);
        this._major = parseInt(major);
        this._minor = parseInt(minor);
        if (last.includes('-') || last.includes('+')) {
            const result = /^([0-9]+)(?:-([^+]+))?(?:\+([^-]+))?$/g.exec(last);
            if (!result) {
                throw new Error(`Invalid version: ${this.version}`);
            }
            let patch = result[1];
            let preRelease = result[2];
            let build = result[3];
            let iteration: string = '';
            this._patch = parseInt(patch);
            if (preRelease) {
                this._preRelease = preRelease;
                if (preRelease && preRelease.includes('.')) {
                    [preRelease, iteration] = preRelease.split('.');
                    this._preReleaseIteration = parseInt(iteration);
                    this._preRelease = preRelease;
                }
            }

            if (build) {
                this._build = build;
                if (build && build.includes('.')) {
                    [build, iteration] = build.split('.');
                    this._buildIteration = parseInt(iteration);
                    this._build = build;
                }
            }
        } else {
            this._patch = parseInt(last);
        }
    }

    equals(version: Version) {
        return this.compareTo(version) === 0;
    }

    isGreaterThan(version: Version) {
        return this.compareTo(version) > 0;
    }

    isSmallerThan(version: Version) {
        return this.compareTo(version) < 0;
    }

    compareTo(version: Version) {
        if (this.tag && version.tag) {
            return this.tag.localeCompare(version.tag);
        }

        if (Boolean(this.tag) !== Boolean(version.tag)) {
            return Boolean(version.tag) ? 1 : -1;
        }

        const majorDiff = this.major - version.major;
        if (majorDiff !== 0) {
            return majorDiff;
        }

        const minorDiff = this.minor - version.minor;
        if (minorDiff !== 0) {
            return minorDiff;
        }

        const patchDiff = this.patch - version.patch;
        if (patchDiff !== 0) {
            return patchDiff;
        }

        if (!version.preRelease && !this.preRelease && !version.build && !this.build) {
            // Both versions are final
            return 0;
        }

        if (version.build !== this.build) {
            return version.build ? 1 : -1;
        }

        if (version.preRelease !== this.preRelease) {
            return version.preRelease ? 1 : -1;
        }

        if (version.build) {
            const buildDiff = (this.buildIteration ?? 0) - (version.buildIteration ?? 0);
            if (buildDiff !== 0) {
                return buildDiff;
            }
        }

        if (version.preRelease) {
            const preReleaseDiff = (this.preReleaseIteration ?? 0) - (version.preReleaseIteration ?? 0);
            if (preReleaseDiff !== 0) {
                return preReleaseDiff;
            }
        }

        return 0;
    }

    public toString() {
        return this.version;
    }

    public toObject() {
        const out: any = {
            major: this.major,
            minor: this.minor,
            patch: this.patch,
            preRelease: this.preRelease,
            preReleaseIteration: this.preReleaseIteration,
            build: this.build,
            buildIteration: this.buildIteration,
        };

        Object.keys(out).forEach((key) => {
            if (out[key] === undefined) {
                delete out[key];
            }
        });

        return out;
    }

    get tag() {
        return this._tag;
    }

    get major() {
        return this._major ?? 0;
    }

    get minor() {
        return this._minor ?? 0;
    }

    get patch() {
        return this._patch ?? 0;
    }

    get preRelease() {
        return this._preRelease;
    }

    get preReleaseIteration() {
        return this._preReleaseIteration;
    }

    get build() {
        return this._build;
    }

    get buildIteration() {
        return this._buildIteration;
    }

    get isPreRelease() {
        return this._preRelease !== undefined;
    }

    get isBuild() {
        return this._build !== undefined;
    }
}

export const createVersion = (
    major: number | string,
    minor: number | string,
    patch: number | string,
    preRelease?: string,
    build?: string
): Version => {
    let version = `${major}.${minor}.${patch}`;
    if (preRelease) {
        version += `-${preRelease}`;
    }
    if (build) {
        version += `+${build}`;
    }
    return parseVersion(version);
};

export const parseVersion = (version: string): Version => {
    return new Version(version);
};
