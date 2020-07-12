const { createServer } = require('net');
const { createHash } = require('crypto');
const port = 8080;
createServer(socket => {
  socket.once('data', data => {
    const mask = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'; //协议规定的固定值
    let headers = {};
    let arr = data.toString().split('\r\n'); //把请求头以换行符切割
    arr.shift(); //去掉数组里的第一个
    arr = arr.filter(item => item); //过滤数组里为空的元素
    arr.forEach(item => {
      let [key, value] = item.split(': ');
      headers[key.toLowerCase()] = value;
    });
    if (headers['connection'] === 'Upgrade' && headers['upgrade'] === 'websocket' && headers['sec-websocket-version'] === '13') {
      let clientKey = headers['sec-websocket-key'];
      let key = clientKey + mask;
      let hashKey = createHash('sha1')
        .update(key)
        .digest('base64');
      let resHeaders = `HTTP/1.1 101 Switching Protocols\r\nConnection: Upgrade\r\nUpgrade: websocket\r\nSec-WebSocket-Accept: ${hashKey}\r\n\r\n`;
      socket.write(resHeaders);
    }
  });
}).listen(port);
