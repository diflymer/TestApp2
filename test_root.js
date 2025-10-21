const http = require('http');

// Test root endpoint
const req = http.request('http://localhost:3000/', {
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Response from root:', data);
  });
});

req.on('error', (err) => {
  console.error('Error:', err.message);
});

req.end();
