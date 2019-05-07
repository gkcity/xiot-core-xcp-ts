import {XcpClientCipher} from '../XcpClientCipher';
import {XcpAuthenticationType} from '../common/XcpAuthenticationType';
import {XcpLTSKGetter} from '../XcpLTSKGetter';
// import {sign, verify} from '@stablelib/ed25519';
import {Ed25519} from 'mipher';

export class XcpClientCipherProductImpl implements XcpClientCipher {

  constructor(private productId: number,
              private productVersion: number,
              private getter: XcpLTSKGetter,
              private serverLTPK: Uint8Array) {
  }

  getAuthenticationType(): XcpAuthenticationType {
    return XcpAuthenticationType.PRODUCT_ID;
  }

  sign(info: Uint8Array): Uint8Array {
    const keypair = this.getter.getProductKeyPair(this.productId, this.productVersion);
    const e = new Ed25519();
    return e.sign(info, keypair.sk, keypair.pk);
    // return sign(keypair.sk, info);
  }

  verify(info: Uint8Array, signature: Uint8Array): boolean {
    const e = new Ed25519();
    return e.verify(info, this.serverLTPK, signature);
    // return verify(this.serverLTPK, info, signature);
  }
}
