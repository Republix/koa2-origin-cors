> # cors middleware for koa2-server
>
[![NPM version][npm-image]][npm-url]
[![Node version][node-version-image]][npm-url]
[![NPM download][npm-download-image]][npm-url]

> 带有域名拦截功能的koa2-cors中间件
>
> ### Features
> - 黑名单域名模式
> - 白名单域名模式 
> - 全局允许模式 (允许所有请求跨域并携带Credentials)
> - 基本跨域请求支持
> 
> <br>
>
> ### Example
>
> ``` 
>  const Koa = require('koa')
>  const cors = require('koa2-cors-mid')  
>  
>  const server = new Koa()
>  server.use(cors())
> ```

> ## 模式说明
>
> ### allowAll
 允许所有跨域请求并允许其携带Credentials凭据
 ```
server.use(cors({allowAll: true}))
 ```

> ### blackList
blackList中的域名将被阻止访问
```
const corsOptoins = {
    blackList: [
        'test.dev.org', '123.22.11.33'
    ],
    terminationCode: 404 // [可选]拦截时返回Status403
    
}
server.use(corsOptions)
```
> ### whiteList
只有白名单中的域名允许访问
注意本地非服务器模式访问时whiteList中添加String(null)
```
const corsOptions = {
    whiteList: [
        '192.168.1.123', 'null'
    ],
    terminationCode: 403 // [可选]拦截时返回Status
}
server.use(corsOptions)
```

> ### origin 
设置允许哪个域名下的访问跨域
```
server.user({
    origin: '192.168.1.110'
})
```

> ### 功能参数说明
>
> - allowAll {Boolean} 允许所有站点跨域并携带凭据
> - blackList {Array} 黑名单列表 黑名单中的域名将被拒绝访问
> - whiteList {Array} 白名单列表 只有白名单中的域名允许访问
> - origin {String | Function} 请求头Origin
> - credentials {Boolean} 允许携带凭据
> - terminationCode {Number} 拒绝返回httpStatus
> - vary {Boolean} 是否强制不同网站使用不同缓存 (a.git, b.git) 
>
>
> 拦截优先级 allowAll > blackList > whiteList > origin

<br><br>

> 说明
> 
> 初衷是想做一个域名拦截中间件，但与跨域设置使用2个中间件略显累赘，且与cors中有多处相似判断逻辑，所以把两部分功能整合到一起
> 
> 整合了一部分[koa2-cors](https://github.com/zadzbw/koa2-cors) 的源码