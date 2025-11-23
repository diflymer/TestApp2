export default (express, bodyParser, createReadStream, crypto, http, zlib) => {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    next();
  });
  app.get('/login/', (req, res) => {
    res.send('diflymer');
  });

  app.get('/makeimage/', (req, res) => {
    const width = parseInt(req.query.width);
    const height = parseInt(req.query.height);

    if (!width || !height || width <= 0 || height <= 0 || width > 10000 || height > 10000) {
      return res.status(400).send('Invalid width or height parameters');
    }

    // Create a simple white PNG image
    const pngBuffer = createPNG(width, height);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', pngBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    res.send(pngBuffer);
  });

// Simple PNG generator for white images
function createPNG(width, height) {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk
  const ihdrLength = Buffer.alloc(4);
  ihdrLength.writeUInt32BE(13, 0);

  const ihdrType = Buffer.from('IHDR');
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);   // Width
  ihdrData.writeUInt32BE(height, 4);  // Height
  ihdrData.writeUInt8(8, 8);          // Bit depth
  ihdrData.writeUInt8(2, 9);          // Color type (RGB)
  ihdrData.writeUInt8(0, 10);         // Compression
  ihdrData.writeUInt8(0, 11);         // Filter
  ihdrData.writeUInt8(0, 12);         // Interlace

  const ihdrCrc = crc32(Buffer.concat([ihdrType, ihdrData]));

  // Create image data (white pixels)
  let imageData = Buffer.alloc(0);
  const bytesPerPixel = 3; // RGB
  const scanlineLength = width * bytesPerPixel + 1; // +1 for filter byte

  for (let y = 0; y < height; y++) {
    const scanline = Buffer.alloc(scanlineLength);
    scanline[0] = 0; // No filter
    // Fill with white (255, 255, 255)
    for (let x = 1; x < scanlineLength; x += 3) {
      scanline[x] = 255;     // R
      scanline[x + 1] = 255; // G
      scanline[x + 2] = 255; // B
    }
    imageData = Buffer.concat([imageData, scanline]);
  }

  // Compress with zlib
  const compressedData = zlib.deflateSync(imageData);

  // IDAT chunk
  const idatLength = Buffer.alloc(4);
  idatLength.writeUInt32BE(compressedData.length, 0);
  const idatType = Buffer.from('IDAT');
  const idatCrc = crc32(Buffer.concat([idatType, compressedData]));

  // IEND chunk
  const iendLength = Buffer.alloc(4);
  iendLength.writeUInt32BE(0, 0);
  const iendType = Buffer.from('IEND');
  const iendCrc = crc32(iendType);

  return Buffer.concat([
    signature,
    ihdrLength, ihdrType, ihdrData, ihdrCrc,
    idatLength, idatType, compressedData, idatCrc,
    iendLength, iendType, iendCrc
  ]);
}

// CRC32 calculation
function crc32(data) {
  const crc = zlib.crc32(data);
  const buf = Buffer.alloc(4);
  buf.writeUInt32BE(crc, 0);
  return buf;
}
  return app;
};
