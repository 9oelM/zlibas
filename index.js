let table = new Uint8Array(256);
let i = 0;

for (; i < 256; ++i) {
  table[i] = ((n) => {
    let r = n;
    let s = 7;
    for (n >>>= 1; n; n >>>= 1) {
      r <<= 1;
      r |= n & 1;
      --s;
    }
    return ((r << s) & 0xff) >>> 0;
  })(i);
}
process.stdout.write("[\n");
for (let i = 0; i < table.length; i++) {
  if (i % 8 === 0) process.stdout.write(" ");
  process.stdout.write(
    ` 0x${table[i].toString(16).padStart(2, "0").toUpperCase()},`,
  );
  if (i % 8 === 7) process.stdout.write("\n");
}
process.stdout.write("]");
