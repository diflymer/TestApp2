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
    res.send('72457f98-f632-4204-8a92-eabc6e8b43a5');
  });
  app.get('/code/', (req, res) => {
    const filePath = import.meta.url.replace(/^file:\/\/\//, '');
    const stream = createReadStream(filePath);
    stream.pipe(res);
  });
  app.get('/sha1/:input/', (req, res) => {
    const hash = crypto.createHash('sha1').update(req.params.input).digest('hex');
    res.send(hash);
  });
  app.all('/req/', (req, res) => {
    const addr = req.method === 'GET' ? req.query.addr : req.body.addr;
    if (!addr) return res.status(400).send('Missing addr parameter');
    http.get(addr, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => res.send(data));
    }).on('error', () => res.status(500).send('Error fetching resource'));
  });
  app.all('*', (req, res) => {
    res.send('72457f98-f632-4204-8a92-eabc6e8b43a5');
  });
  return app;
};
