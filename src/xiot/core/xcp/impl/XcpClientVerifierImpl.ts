import {XcpClientVerifier} from '../XcpClientVerifier';
import {XcpSessionKey} from '../common/XcpSessionKey';
import {XcpClient} from '../XcpClient';
import {XcpClientCipher} from '../XcpClientCipher';
import {XcpFrameCodecType, XcpFrameCodecTypeToNumber} from '../common/XcpFrameCodecType';
import {Convert, Curve25519, Random} from 'mipher';
import {QueryInitialize} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/basic/Initialize';
import {XcpAuthenticationTypeToString} from '../common/XcpAuthenticationType';
import {QueryVerifyStart, ResultVerifyStart} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/basic/VerifyStart';
import {QueryVerifyFinish, ResultVerifyFinish} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/basic/VerifyFinish';
import {KeyPair} from '../KeyPair';
import {XcpKeyCreator} from '../key/XcpKeyCreator';
import {XcpKeyType} from '../key/XcpKeyType';
import {BytesJoin, StringToUint8Array} from '../utils/Uint8ArrayUtils';
import {ChaCha20Poly1305} from '@stablelib/chacha20poly1305';
import {IQResult} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/IQResult';

// import {X25519KeyAgreement} from '@stablelib/x25519';

export class XcpClientVerifierImpl implements XcpClientVerifier {

  private sharedKey: Uint8Array | null = null;
  private verifyKey: Uint8Array | null = null;
  private sessionInfo: Uint8Array | null = null;
  // private keyAgreement: X25519KeyAgreement;

  constructor(private client: XcpClient,
              private version: string,
              private cipher: XcpClientCipher,
              private codec: XcpFrameCodecType) {
  }

  start(): Promise<XcpSessionKey> {
    return this.initialization()
      .then(x => this.verifyStart(x))
      .then(n => this.verifyFinish(n));
  }

  private initialization(): Promise<KeyPair> {
    const auth = XcpAuthenticationTypeToString(this.cipher.getAuthenticationType());
    const query = new QueryInitialize(this.client.getNextId(), this.version, auth);
    return this.client.sendQuery(query).then(() => this.generateKeyPair());
  }

  private generateKeyPair(): KeyPair {
    const random = new Random();
    const c = new Curve25519();
    const seed = random.get(32);
    const k = c.generateKeys(seed);
    return new KeyPair(k.pk, k.sk);
  }

  // private generateKeyPair(): Uint8Array {
  //   this.keyAgreement = new X25519KeyAgreement();
  //   return this.keyAgreement.offer();
  // }

  private verifyStart(keyPair: KeyPair): Promise<Uint8Array> {
    const publicKey = Convert.bin2base64(keyPair.pk);
    console.log('verifyStart publicKey: ' + publicKey);
    const query = new QueryVerifyStart(this.client.getNextId(), publicKey);
    return this.client.sendQuery(query).then(x => this.parseResultVerifyStart(keyPair, x));
  }

  private parseResultVerifyStart(keyPair: KeyPair, x: IQResult): Uint8Array {
    if (! (x instanceof ResultVerifyStart)) {
      throw new Error('invalid result');
    }

    const serverPublicKey = Convert.base642bin(x.publicKey);
    const serverEncryptedSignature = Convert.base642bin(x.signature);

    // this.sharedKey = this.keyAgreement.getSharedKey();

    const c = new Curve25519();
    this.sharedKey = c.scalarMult(keyPair.sk, serverPublicKey);
    console.log('SharedKey: ', Convert.bin2base64(this.sharedKey));

    this.verifyKey = XcpKeyCreator.create(this.sharedKey, XcpKeyType.SESSION_VERIFY_ENCRYPT_KEY);
    if (this.verifyKey != null) {
      console.log('VerifyKey: ', Convert.bin2base64(this.verifyKey));
    }

    this.sessionInfo = BytesJoin(keyPair.pk, serverPublicKey);
    console.log('SessionInfo: ', Convert.bin2base64(this.sessionInfo));

    return serverEncryptedSignature;
  }

  private verifyFinish(serverEncryptedSignature: Uint8Array): Promise<XcpSessionKey> {
    if (this.verifyKey == null || this.sessionInfo == null) {
      throw new Error('invalid result');
    }

    const cc = new ChaCha20Poly1305(this.verifyKey);
    const serverSignature = cc.open(StringToUint8Array('SV-Msg02'), serverEncryptedSignature);
    if (serverSignature == null) {
      console.log('decode serverSignature failed, serverSignature is null');
      throw new Error('decode serverSignature failed, serverSignature is null');
    }

    if (! this.cipher.verify(this.sessionInfo, serverSignature)) {
      console.log('server signature verified failed');
      throw new Error('server signature verified failed');
    }

    const signature = this.cipher.sign(this.sessionInfo);
    const encryptedSignature = Convert.bin2base64(cc.seal(StringToUint8Array('SV-Msg03'), signature));
    console.log('device signature: ', Convert.bin2base64(signature));

    const udid = Convert.bin2base64(cc.seal(StringToUint8Array('SV-Msg03'), StringToUint8Array(this.client.getUdid())));
    const id = this.client.getNextId();
    const frameCodecType = XcpFrameCodecTypeToNumber(this.codec);
    const query = new QueryVerifyFinish(id, udid, encryptedSignature, frameCodecType);
    return this.client.sendQuery(query).then(x => this.parseResultVerifyFinish(x));
  }

  private parseResultVerifyFinish(x: IQResult): XcpSessionKey {
    if (! (x instanceof ResultVerifyFinish)) {
      throw new Error('invalid result');
    }

    if (this.sharedKey == null) {
      throw new Error('invalid result');
    }

    const outKey = XcpKeyCreator.create(this.sharedKey, XcpKeyType.DEVICE_TO_SERVER_KEY);
    if (outKey == null) {
      throw new Error('invalid result');
    }

    const inKey = XcpKeyCreator.create(this.sharedKey, XcpKeyType.SERVER_TO_DEVICE_KEY);
    if (inKey == null) {
      throw new Error('invalid result');
    }

    console.log('outKey: ', Convert.bin2base64(outKey));
    console.log('inKey: ', Convert.bin2base64(inKey));

    return new XcpSessionKey(this.codec, outKey, inKey);
  }
}
