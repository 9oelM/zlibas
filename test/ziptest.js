const Deflate = require("../dist/dev/zip.dev").Zip;
const Inflate = require("../dist/dev/zip.dev").Inflate;

const datas = [1, 2, 3, 4, 5, 6];
console.log(`input data: ${datas}`);
const deflate = new Deflate(datas);
const compress = deflate.compress();

const inflate = new Inflate(compress);
const plain = inflate.decompress();
var resultArray = Array.from(plain);

console.log(`result: ${resultArray}`);
