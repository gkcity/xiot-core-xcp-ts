export enum XcpAuthenticationType {
  UNDEFINED,
  DEVICE_ID,
  PRODUCT_ID,
}

const _XcpAuthenticationTypeMapping: [XcpAuthenticationType, string][] = [
  [XcpAuthenticationType.DEVICE_ID, 'device-id'],
  [XcpAuthenticationType.PRODUCT_ID, 'product-id'],
];

export function XcpAuthenticationTypeToString(type: XcpAuthenticationType): string {
  for (const t of _XcpAuthenticationTypeMapping) {
    if (t[0] === type) {
      return t[1];
    }
  }

  return 'none';
}

export function XcpAuthenticationTypeFromString(type: string): XcpAuthenticationType {
  for (const t of _XcpAuthenticationTypeMapping) {
    if (t[1] === type) {
      return t[0];
    }
  }

  return XcpAuthenticationType.UNDEFINED;
}
