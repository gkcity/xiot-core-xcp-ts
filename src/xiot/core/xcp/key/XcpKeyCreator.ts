import {XcpKeyType} from './XcpKeyType';
import {StringToUint8Array} from '../utils/Uint8ArrayUtils';
import {HKDF} from '@stablelib/hkdf';
import {SHA512} from '@stablelib/sha512';

const SESSION_VERIFY_START_SALT = 'Session-Verify-Encrypt-Salt';
const SESSION_VERIFY_START_INFO = 'Session-Verify-Encrypt-Info';
const SESSION_SALT = 'Session-Encryption-Salt';
const DEVICE_TO_SERVER = 'Session-D2S-Encryption-Info';
const SERVER_TO_DEVICE = 'Session-S2D-Encryption-Info';

export class XcpKeyCreator {

  public static create(sharedKey: Uint8Array, type: XcpKeyType): Uint8Array | null {
    switch (type) {
      case XcpKeyType.SESSION_VERIFY_ENCRYPT_KEY:
        return this.digest(SESSION_VERIFY_START_SALT, SESSION_VERIFY_START_INFO, sharedKey);

      case XcpKeyType.DEVICE_TO_SERVER_KEY:
        return this.digest(SESSION_SALT, DEVICE_TO_SERVER, sharedKey);

      case XcpKeyType.SERVER_TO_DEVICE_KEY:
        return this.digest(SESSION_SALT, SERVER_TO_DEVICE, sharedKey);
    }

    return null;
  }

  private static digest(salt: string, info: string, key: Uint8Array): Uint8Array {
    const hkdf = new HKDF(SHA512, key, StringToUint8Array(salt), StringToUint8Array(info));
    return hkdf.expand(32);
  }
}
