import {XcpAuthenticationType} from './common/XcpAuthenticationType';

export interface XcpClientCipher {

  getAuthenticationType(): XcpAuthenticationType;

  sign(info: Uint8Array): Uint8Array;

  verify(info: Uint8Array, signature: Uint8Array): boolean;
}
