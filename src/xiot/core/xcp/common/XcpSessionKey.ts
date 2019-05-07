import {XcpFrameCodecType} from './XcpFrameCodecType';


export class XcpSessionKey {

  public codec: XcpFrameCodecType;
  public deviceToServer: Uint8Array;
  public serverToDevice: Uint8Array;

  constructor(codec: XcpFrameCodecType, deviceToServer: Uint8Array, serverToDevice: Uint8Array) {
    this.codec = codec;
    this.deviceToServer = deviceToServer;
    this.serverToDevice = serverToDevice;
  }
}
