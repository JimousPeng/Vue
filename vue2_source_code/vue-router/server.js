const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    const readStream = fs.createReadStream('./template-hash.html');
    res.setHeader('Content-Type', 'text/html');
    readStream.pipe(res);
}).listen(3000, () => {
    console.log('服务start--------');
});
