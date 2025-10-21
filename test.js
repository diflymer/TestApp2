const http = require('http');

// Test /login endpoint
const req = http.request('http://localhost:3000/login', {
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Response from /login:', data);
  });
});

req.on('error', (err) => {
  console.error('Error:', err.message);
});

req.end();
