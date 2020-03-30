let table = new Uint32Array(256);
let c;
let i;
let j;

for (i = 0; i < 256; ++i) {
  c = i;
  for (j = 0; j < 8; ++j) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[i] = c >>> 0;
}

process.stdout.write("[\n");
for (let i = 0; i < table.length; i++) {
  if (i % 8 === 0) process.stdout.write(" ");
  process.stdout.write(
    ` 0x${table[i].toString(16).padStart(8, "0").toUpperCase()},`,
  );
  if (i % 8 === 7) process.stdout.write("\n");
}
process.stdout.write("]");
