import {BinaryFrameCodec} from '../BinaryFrameCodec';
import {ChaCha20Poly1305} from '@stablelib/chacha20poly1305';
import {Buffer} from 'buffer';

export class WebSocketBinaryFrameCodecImpl implements BinaryFrameCodec {

  private inCount = 0;
  private outCount = 0;

  constructor(private deviceToServer: Uint8Array,
              private serverToDevice: Uint8Array) {
  }

  encrypt(data: Uint8Array): Uint8Array {
    const cc = new ChaCha20Poly1305(this.deviceToServer);
    const nonce = new Buffer(8);
    nonce.writeInt32LE(this.inCount++, 0);
    return cc.seal(nonce, data);
  }

  decrypt(data: Uint8Array): Uint8Array | null {
    const cc = new ChaCha20Poly1305(this.serverToDevice);
    const nonce = new Buffer(8);
    nonce.writeInt32LE(this.outCount++, 0);
    return cc.open(nonce, data);
  }
}
