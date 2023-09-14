const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path'); // Add this line to import the 'path' module

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const requestUrl = parsedUrl.pathname;
  const timestamp = new Date().toISOString();

  // Log the request URL and timestamp to the "log.txt" file
  fs.appendFile('log.txt', `${requestUrl} - ${timestamp}\n`, (err) => {
    if (err) {
      console.error('Error logging request:', err);
    }
  });

  // Serve the appropriate HTML file based on the request URL
  if (requestUrl === '/') {
    // If the root URL is requested, serve "index.html"
    const indexPath = path.join(__dirname, 'index.html');
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (requestUrl === '/documentation') {
    // Handle requests for the documentation here
    // You can serve the "documentation.html" file in a similar way
  } else {
    // Handle other requests or return a 404 Not Found response
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
