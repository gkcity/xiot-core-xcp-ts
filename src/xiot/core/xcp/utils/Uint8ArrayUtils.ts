export function StringToUint8Array(s: string): Uint8Array {
  const array = new Uint8Array(s.length);

  for (let i = 0; i < s.length; ++i) {
    array[i] = s.charCodeAt(i);
  }

  return array;
}

export function BytesJoin(a: Uint8Array, b: Uint8Array): Uint8Array {
  const c = new Uint8Array(a.length + b.length);
  c.set(a);
  c.set(b, a.length);
  return c;
}


export function Utf8ArrayToStr(array: Uint8Array): string {
  const len = array.length;
  let out = '';
  let i = 0;
  let c: number;
  let char2;
  let char3;

  while (i < len) {
    c = array[i++];

    switch (c / 16) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;

      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;

      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
        break;
    }
  }

  return out;
}
