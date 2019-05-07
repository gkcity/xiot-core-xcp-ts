

export class KeyPair {

  public pk: Uint8Array;
  public sk: Uint8Array;

  constructor(pk: Uint8Array, sk: Uint8Array) {
    this.pk = pk;
    this.sk = sk;
  }
}
