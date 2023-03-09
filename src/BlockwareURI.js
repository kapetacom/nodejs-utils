class BlockwareURI {
  /**
   *
   * @param {string} uri
   */
  constructor(uri) {
    this._uri = uri;
    this._data = this._parse();
  }

  get protocol() {
    return this._data.protocol;
  }

  set protocol(protocol) {
    this._data.protocol = protocol;
  }

  get name() {
    return this._data.name;
  }

  set name(name) {
    this._data.name = name;
  }

  get handle() {
    return this._data.handle;
  }

  set handle(handle) {
    this._data.handle = handle;
  }

  get version() {
    return this._data.version;
  }

  set version(version) {
    this._data.version = version;
  }

  get id() {
    return `${this.handle}/${this.name}:${this.version}`.toLowerCase();
  }

  get fullName() {
    return `${this.handle}/${this.name}`.toLowerCase();
  }

  /**
   *
   * @param {BlockwareURI} otherUri
   */
  compare(otherUri) {
    return this.id.localeCompare(otherUri.id);
  }

  /**
   *
   * @param {BlockwareURI} otherUri
   */
  equals(otherUri) {
    return this.id === otherUri.id;
  }

  toString() {
    return this.version ? this.id : this.fullName;
  }

  /**
   *
   * @return {{protocol: string, name: string, fullName: string, handle: string, id: string, version: string}}
   * @private
   */
  _parse() {
    const uri = this._uri;
    const rx = /^(?:([^\/\s:]+):\/\/)?([^\/\s:]+)\/([^\s:\/]+)(?::(\S+))?$/i;

    if (!rx.test(uri)) {
      throw new Error("Invalid blockware uri: " + uri);
    }

    let [, protocol, handle, name, version] = rx.exec(uri);

    if (!version) {
      version = "";
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

exports.BlockwareURI = BlockwareURI;

/**
 *
 * @param uri {string}
 * @returns {BlockwareURI}
 */
exports.parseBlockwareUri = function parseBlockwareUri(uri) {
  return new BlockwareURI(uri);
};
