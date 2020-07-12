## websocket 握手原理

#### 安装依赖

```
npm i
```

#### 运行

```
npm start
```

#### 项目说明

- 此处用到了 nodejs 的核心模块 net，我们经常用到的 http 模块，就是继承自 net 模块。
- 此模块偏底层，数据需要自行处理解析

#### 实现原理

- 当我们试图建立一个 socket 连接时，客户端请求头会携带一个字段 sec-websocket-key
- 服务端拿到这个 key 后，会进行以下的处理并组成一个新的字段 sec-websocket-accept 在响应头里给到客户端

```
sec-websocket-accept = base64(sha1(sec-websocket-key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'))
```

- 关于上面的'258EAFA5-E914-47DA-95CA-C5AB0DC85B11'这是个协议规定的固定值，相关资料可参阅 https://tools.ietf.org/html/rfc6455

- 生成字段 sec-websocket-accept 后，还需要给客户端设置以下响应头

```
sec-websocket-accept: 'xxx'
connection: upgrade
upgrade: websocket
```

- 协议是 HTTP/1.1，状态码是 101，状态信息是 Switching Protocols
- 完成以上，websocket 握手阶段才算完成，之后就可以进行 socket 通信
