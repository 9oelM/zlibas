import { util } from "./util";

export class Alder {
  public static OptimizationParameter = 1024;
  constructor() {}
  public static update(adler: u32, array: StaticArray<u8>): u32 {
    let s1 = adler & 0xffff;
    let s2 = (adler >>> 16) & 0xffff;
    let len = array.length;
    let tlen: i32;
    let i = 0;

    while (len > 0) {
      tlen =
        len > Alder.OptimizationParameter ? Alder.OptimizationParameter : len;
      len -= tlen;
      do {
        s1 += array[i++];
        s2 += s1;
      } while (--tlen);

      s1 %= 65521;
      s2 %= 65521;
    }
    return (s2 << 16) | s1;
  }
}
export function Adler32<T>(array: T): u32 {
  util.isu8ArrayLike<T>();
  let data = new StaticArray<u8>();
  util.copy(array, data);
  return Alder.update(1, data);
}
