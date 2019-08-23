import {XcpClient} from '../XcpClient';
import {XcpClientVerifier} from '../XcpClientVerifier';
import {XcpClientVerifierImpl} from './XcpClientVerifierImpl';
import {XcpFrameCodecType} from '../common/XcpFrameCodecType';
import {XcpClientCipher} from '../XcpClientCipher';
import {XcpSessionKey} from '../common/XcpSessionKey';
import {WebSocketBinaryFrameCodecImpl} from '../codec/WebSocketBinaryFrameCodecImpl';
import {BinaryFrameCodec} from '../BinaryFrameCodec';
import {Utf8ArrayToStr} from '../utils/Uint8ArrayUtils';
import {IQ, IQError, IQQuery, IQResult, IQType, XcpMessage, XcpMessageCodec} from '../../../..';
import {OperationStatus, XcpUniversalDID} from 'xiot-core-spec-ts';

export class XcpClientBase implements XcpClient {

  private ws: WebSocket | null = null;
  private udid: XcpUniversalDID;
  private verifier: XcpClientVerifier | null = null;
  private verified = false;
  private frameCodec: BinaryFrameCodec | null = null;
  private messageCodec: XcpMessageCodec;
  private resultHandlers: Map<string, (result: IQResult | null, error: IQError | null) => void>;
  private queryHandlers: Map<string, (query: IQQuery) => void>;
  private messageId = 1;
  private verifyHandler: (result: boolean) => void = () => {};
  private disconnectHandler: () => void = () => {};

  constructor(serialNumber: string,
              productId: number,
              productVersion: number,
              private cipher: XcpClientCipher,
              private codec: XcpFrameCodecType) {
    this.udid = new XcpUniversalDID(serialNumber, productId, productVersion);
    this.messageCodec = new XcpMessageCodec();
    this.resultHandlers = new Map<string, (result: IQResult | null, error: IQError | null) => void>();
    this.queryHandlers = new Map<string, (query: IQQuery) => void>();
  }

  protected createWebSocket(url: string): any {
    // this.ws = new WebSocket(url);
    throw Error('createWebSocket failed !');
  }

  connect(host: string, port: number, uri: string): Promise<void> {
    const url = 'ws://' + host + ':' + port + uri;
    console.log('connect: ' + url);

    this.ws = this.createWebSocket(url);
    if (this.ws == null) {
      throw Error('new WebSocket Failed!');
    }

    this.ws.addEventListener('open', () => this.onConnected());
    this.ws.addEventListener('close', () => this.onDisconnect());
    this.ws.addEventListener('error', () => this.onError());
    this.ws.addEventListener('message', message => this.onMessage(message));

    return new Promise<void>((resolve, reject) => {
      this.verifyHandler = (result) => {
        if (result) {
          resolve();
          return;
        }

        reject();
      };
    });
  }

  disconnect(): void {
    if (this.ws != null) {
      this.ws.close();
    }
  }

  getSerialNumber(): string {
    return this.udid.serialNumber;
  }

  getProductId(): number {
    return this.udid.productId;
  }

  getProductVersion(): number {
    return this.udid.productVersion;
  }

  getUdid(): string {
    return this.udid.toString();
  }

  getDeviceId(): string {
    return this.udid.did;
  }

  getNextId(): string {
    return this.udid.toString() + '#' + Date.now() + '#' + this.messageId++;
  }

  addQueryHandler(method: string, handler: (query: IQQuery) => void): void {
    console.log('addQueryHandler: ', method);
    this.queryHandlers.set(method, handler);
  }

  addDisconnectHandler(handler: () => void): void {
    this.disconnectHandler = handler;
  }

  sendQuery(query: IQQuery): Promise<IQResult> {
    this.write(this.messageCodec.encode(query));
    return new Promise<IQResult>((resolve, reject) => {
      this.resultHandlers.set(query.id, (result, error) => {
        if (error != null) {
          reject(error);
          return;
        }

        if (result == null) {
          return;
        }

        resolve(result);
      });
    });
  }

  sendResult(result: IQResult): void {
    this.write(this.messageCodec.encode(result));
  }

  sendError(error: IQError): void {
    this.write(this.messageCodec.encode(error));
  }

  private onConnected(): void {
    console.log('onConnected');
    this.startVerify('1.0')
        .then(() => this.verifyHandler(true))
        .catch(e => this.verifyHandler(false));
  }

  private onDisconnect(): void {
    console.log('onDisconnect');
    this.ws = null;
    this.disconnectHandler();
  }

  private onError(): void {
    console.log('onError');
    this.ws = null;
  }

  private onMessage(message: any): void {
    let msg: XcpMessage | null = null;

    if (this.frameCodec == null) {
      console.log(Date() + ' recv text frame: ', message.data);
      msg = this.messageCodec.decode(message.data);
    } else {
      const data = this.frameCodec.decrypt(message.data);
      if (data != null) {
        const s = Utf8ArrayToStr(data);
        console.log(Date() + ' recv binary frame: ', s);
        msg = this.messageCodec.decode(s);
      }
    }

    if (msg == null) {
      return;
    }

    this.handleMessage(msg);
  }

  private handleMessage(message: XcpMessage) {
    if (message instanceof IQ) {
      switch (message.type) {
        case IQType.QUERY:
          this.handleQuery(message);
          break;

        case IQType.RESULT:
          this.handleResult(message);
          break;

        case IQType.ERROR:
          this.handleError(message);
          break;

        default:
          console.log('invalid message: ', message);
          break;
      }
    } else {
      console.log('message not IQ: ', message);
    }
  }

  private handleQuery(query: IQ) {
    if (! (query instanceof IQQuery)) {
      return;
    }

    const handler = this.queryHandlers.get(query.method);
    if (handler != null) {
      handler(query);
    } else {
      this.sendError(query.error(OperationStatus.UNDEFINED, 'Query Handler not found'));
    }
  }

  private handleResult(result: IQ) {
    if (! (result instanceof IQResult)) {
      return;
    }

    const handler = this.resultHandlers.get(result.id);
    if (handler != null) {
      handler(result, null);
      this.resultHandlers.delete(result.id);
    } else {
      console.log('handle for result not found: ', result.id);
    }
  }

  private handleError(error: IQ) {
    if (! (error instanceof IQError)) {
      return;
    }

    const handler = this.resultHandlers.get(error.id);
    if (handler != null) {
      handler(null, error);
      this.resultHandlers.delete(error.id);
    } else {
      console.log('handle for error not found: ', error.id);
    }
  }

  private startVerify(version: string): Promise<void> {
    this.verifier = new XcpClientVerifierImpl(this, version, this.cipher, this.codec);
    return this.verifier.start().then(x => this.setXcpSessionKey(x));
  }

  private setXcpSessionKey(key: XcpSessionKey): void {
    console.log('setXcpSessionKey, codec: ', key.codec);

    if (key.codec !== XcpFrameCodecType.NOT_CRYPT) {
      this.frameCodec = new WebSocketBinaryFrameCodecImpl(key.deviceToServer, key.serverToDevice);
    }

    console.log('verify succeed!');
    this.verified = true;
  }

  private write(o: Object) {
    const s = JSON.stringify(o);
    console.log(Date() + ' write: ', s);

    if (this.ws != null) {
      this.ws.send(s);
    }
  }
}
