import { createCanvas } from 'canvas';

export default (express, bodyParser, createReadStream, crypto, http) => {
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

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    res.setHeader('Content-Type', 'image/png');
    canvas.pngStream().pipe(res);
  });
  return app;
};
