export enum IQType {
  UNDEFINED,
  QUERY,
  RESULT,
  ERROR,
}

const _IQTypeMapping: [IQType, string][] = [
  [IQType.QUERY, 'query'],
  [IQType.RESULT, 'result'],
  [IQType.ERROR, 'error'],
];

export function IQTypeToString(type: IQType): string {
  for (const t of _IQTypeMapping) {
    if (t[0] === type) {
      return t[1];
    }
  }

  return 'none';
}

export function IQTypeFromString(type: string): IQType {
  for (const t of _IQTypeMapping) {
    if (t[1] === type) {
      return t[0];
    }
  }

  return IQType.UNDEFINED;
}
