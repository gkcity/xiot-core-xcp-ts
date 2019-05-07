import {KeyPair} from './KeyPair';

export interface XcpLTSKGetter {

  getDeviceKeypair(deviceId: string): KeyPair;

  getProductKeyPair(productId: number, productVersion: number): KeyPair;
}
