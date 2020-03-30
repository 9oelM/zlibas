export namespace util {
  @inline
  export function isu8ArrayLike<T>(): void {
    if (!isArrayLike<T>())
      ERROR("Generic T parameter must be ArrayLike that returns u8 values.");
    if (!isInteger<valueof<T>>())
      ERROR("Generic T parameter must be ArrayLike that returns u8 values.");
    if (alignof<valueof<T>>() !== 0)
      ERROR("Generic T parameter must be ArrayLike that returns u8 values.");
  }

  @inline
  export function copy<T>(from: T, to: StaticArray<u8>): void {
    let length = from.length;
    for (let i = 0; i < length; i++) {
      if (isDefined(unchecked(from[0]))) {
        unchecked((to[i] = unchecked(from[i])));
      } else {
        unchecked((to[i] = from[i]));
      }
    }
  }
}
