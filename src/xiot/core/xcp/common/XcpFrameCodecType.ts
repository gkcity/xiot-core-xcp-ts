export enum XcpFrameCodecType {
  UNDEFINED,
  NOT_CRYPT,
  CHACHA20_POLY1305,
  AES_HKDF_SHA1,
}

const _XcpFrameCodecTypeMapping: [XcpFrameCodecType, number][] = [
  [XcpFrameCodecType.NOT_CRYPT, 0],
  [XcpFrameCodecType.CHACHA20_POLY1305, 1],
  [XcpFrameCodecType.AES_HKDF_SHA1, 2],
];

export function XcpFrameCodecTypeToNumber(type: XcpFrameCodecType): number {
  for (const t of _XcpFrameCodecTypeMapping) {
    if (t[0] === type) {
      return t[1];
    }
  }

  return 0;
}

export function XcpFrameCodecTypeFromNumber(type: number): XcpFrameCodecType {
  for (const t of _XcpFrameCodecTypeMapping) {
    if (t[1] === type) {
      return t[0];
    }
  }

  return XcpFrameCodecType.UNDEFINED;
}
