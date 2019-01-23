
/**
 * @param {Object} [options]
 * @version 1.1
 * - allowAll {Boolean} 放行所有，允许任意请求携带credentials
 * - blackList 黑名单模式，黑名单中的域名无法访问
 * - whiteList 白名单模式，仅白名单中的允许访问, 注意本地开发时添加 String(null)
 * - origin 指定origin允许访问，如果设置为 '*' 见下条
 * - credentials {Boolean} 是否允许携带credentials数据（cookies，自定义headers等） origin设置为'*'时，ACAO 将被设置为request.origin
 * 
 * options
 * - 三种模式
 * - vary
 * - code
 */
module.exports = (options = {}) => {


    const defaultOptions = {
        allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        terminationCode: 403,
        credentials: false, // 凭据强制设置
    }
    
    options = Object.assign({}, defaultOptions, options) // merge

    const credentials = Boolean(options.credentials), // 强制设置 origin 设置为 '*'时 允许 credentials
          vary = Boolean(options.vary),
          allowMethods = options.allowMethods && options.allowMethods.join(','),
          allowHeaders = options.allowHeaders && options.allowHeaders.join(','),
          exposeHeaders = options.exposeHeaders && options.exposeHeaders.join(','),
          terminationCode = defaultOptions.terminationCode
    
    const MODE = options.allowAll === true ?
                0 : (options.blackList && options.blackList.length > 0) ?
                1 : (options.whiteList && options.whiteList.length > 0) ?
                2 : options.origin ?
                3 : null

    return async function cors(ctx, next) {

        vary && ctx.vary('Origin') // 确保不同网站发起的请求使用各自的缓存  a.git.c  b.git.c问题    
        
        // 同源
        if (ctx.request.header.origin === ctx.origin) {
            return await next()
        }

        // 配置origin参数
        let origin = ctx.request.header.origin
        
        if (MODE === 0) { // 放行
        } else if (MODE === 1 && options.blackList.includes(origin)) { // blackList mode
            ctx.status = terminationCode
            return
        } else if (MODE === 2 && !options.whiteList.includes(origin)) { // whiteList mode
            ctx.status = terminationCode
            return
        } else if (MODE === 3) { // 仅设置了 origin
            origin = options.origin === '*' ? 
                    (credentials ? origin : '*') : typeof options.origin === 'function' ? 
                    options.origin(ctx) : options.origin
        } else { // 其他情况
            return await next() // 不做处理
        }


        ctx.set('Access-Control-Allow-Origin', origin)
        
        // 跨域请求处理
        // https://developer.mozilla.org/zh-CN/docs/Glossary/Preflight_request
        if (ctx.method === 'OPTIONS') {

            if (!ctx.get('Access-Control-Request-Method')) {
                return await next()
            }
            
            // 在该期限内请求不需要校检，所以不需要再简单请求中设置
            if (options.maxAge) {
                ctx.set('Access-Control-Max-Age', String(options.maxAge))
            }

            // 设置是否允许携带Cookies
            if (options.credentials === true || MODE === 0) {
                console.log('123', ctx.get('Access-Control-Allow-Origin'))

                ctx.set('Access-Control-Allow-Credentials', 'true');
            }

            if (options.allowMethods) {
                ctx.set('Access-Control-Allow-Methods', allowMethods);
            }

            if (options.allowHeaders) {
                ctx.set('Access-Control-Allow-Headers', allowHeaders);
            } else {
                ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'));
            }

            ctx.status = 204; // No Content

        } else { // 非 Options请求

            if (options.credentials === true || MODE === 0) {
                if (origin === '*') { // 
                    // `credentials` can't be true when the `origin` is set to `*`
                    ctx.remove('Access-Control-Allow-Credentials');
                } else {
                    ctx.set('Access-Control-Allow-Credentials', 'true');
                }
            }

            // Access-Control-Expose-Headers
            if (options.exposeHeaders) {
                ctx.set('Access-Control-Expose-Headers', exposeHeaders);
            }

            try {
                await next();
            } catch (err) {
                throw err;
            }
        }
    } 
} 