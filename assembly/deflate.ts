import { Adler32 } from "./adler32";
import { RawDeflate, CompressionType } from "./rawdeflate";
import { CompressionMethod } from "./define/compress";


export class Deflate {
  public static compress(
    input: StaticArray<u8>,
  ) {
    return new Deflate(input, opt_params).compress();
  }
  public static DefaultBufferSize = 0x8000;
  //public CompressionType = RawDeflate.CompressionType;

  private output: StaticArray<u8>;

  private rawDeflate: RawDeflate;
  private rawDeflateOption: any = {};

  constructor(
    private input: StaticArray<u8>,
    private compressionType: CompressionType = CompressionType.DYNAMIC,
    private output: 
    ) {
    this.input = input;
    this.output = new StaticArray<u8>(Deflate.DefaultBufferSize);
    this.compressionType = CompressionType.DYNAMIC;
    this.rawDeflateOption = {};


    // copy options
    // TODO: if (opt_params) {
    // TODO:   const props = Object.keys(opt_params);
    // TODO:   for (let prop of props) {
    // TODO:     this.rawDeflateOption[prop] = opt_params[prop];
    // TODO:   }
    // TODO: }
    // set raw-deflate output buffer
    this.rawDeflateOption.outputBuffer = this.output;
    this.rawDeflate = new RawDeflate(this.input, this.rawDeflateOption);
  }

  public compress() {
    /** @type {Zlib.CompressionMethod} */
    let cm;
    /** @type {number} */
    let cinfo;
    /** @type {number} */
    let cmf;
    /** @type {number} */
    let flg;
    /** @type {number} */
    let fcheck;
    /** @type {number} */
    let fdict;
    /** @type {number} */
    let flevel;
    /** @type {number} */
    let adler;
    /** @type {!(Array|Uint8Array)} */
    let output;
    /** @type {number} */
    let pos = 0;
    output = this.output;
    // Compression Method and Flags
    cm = CompressionMethod.DEFLATE;
    switch (cm) {
      case CompressionMethod.DEFLATE:
        cinfo = Math.LOG2E * Math.log(RawDeflate.WindowSize) - 8;
        break;
      default:
        throw new Error("invalid compression method");
    }
    cmf = (cinfo << 4) | cm;
    output[pos++] = cmf;
    // Flags
    fdict = 0;
    switch (cm) {
      case CompressionMethod.DEFLATE:
        switch (this.compressionType) {
          case CompressionType.NONE:
            flevel = 0;
            break;
          case CompressionType.FIXED:
            flevel = 1;
            break;
          case CompressionType.DYNAMIC:
            flevel = 2;
            break;
          default:
            throw new Error("unsupported compression type");
        }
        break;
      default:
        throw new Error("invalid compression method");
    }
    flg = (flevel << 6) | (fdict << 5);
    fcheck = 31 - ((cmf * 256 + flg) % 31);
    flg |= fcheck;
    output[pos++] = flg;
    // Adler-32 checksum
    adler = Adler32(this.input);
    this.rawDeflate.op = pos;
    output = this.rawDeflate.compress();
    pos = output.length;
    if (USE_TYPEDARRAY) {
      output = new Uint8Array(output.buffer);
      if (output.length <= pos + 4) {
        this.output = new Uint8Array(output.length + 4);
        this.output.set(output);
        output = this.output;
      }
      output = output.subarray(0, pos + 4);
    }
    // adler32
    output[pos++] = (adler >> 24) & 0xff;
    output[pos++] = (adler >> 16) & 0xff;
    output[pos++] = (adler >> 8) & 0xff;
    output[pos++] = adler & 0xff;
    return output;
  }
}
