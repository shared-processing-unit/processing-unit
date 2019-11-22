const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', ws => {
    console.log('WebSocket-Server ready on Port 8080')
    ws.on('message', message =>
        console.log(`received: ${JSON.stringify(message)}`)
    )
    setInterval(
        () =>
            ws.send(
                JSON.stringify({
                    algorithm: `(function () {var b={},f=b&&b.__spreadArrays||function(){for(var r=0,e=0,$=arguments.length;e<$;e++)r+=arguments[e].length;var t=Array(r),c=0;for(e=0;e<$;e++)for(var o=arguments[e],m=0,n=o.length;m<n;m++,c++)t[c]=o[m];return t};Object.defineProperty(b,"__esModule",{value:!0});var j=function(r){return r.reduce(function(r,e,$){return f(r,[0===$?e:b.vectorAdd(r[$-1],e)])},[])};b.cumSum=j;var k=function(r){return f(r).reverse()};b.reverse=k;var l=function(r,e){if(r.length!==e.length)throw Error("vectorlength should be same.");return r.map(function(r,$){return r+e[$]})};b.vectorAdd=l;var e={};Object.defineProperty(e,"__esModule",{value:!0});var m=function(e){var r;return(r=[]).concat.apply(r,e).reduce(function(e,r){return e+r},0)};e.default=m;var a={},n=a&&a.__importDefault||function($){return $&&$.__esModule?$:{default:$}};Object.defineProperty(a,"__esModule",{value:!0});var g=n(e),o=function($){return $.map(function($){var e=g.default($);return(1-g.default($.map(function($){return $*$/(e*e)})))*e})};a.default=o;var c={},h=c&&c.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(c,"__esModule",{value:!0});var p=h(e),i=h(a),q=function(e){var r=p.default(e),$=i.default(b.cumSum(e)),t=b.reverse(i.default(b.cumSum(b.reverse(e)))).slice(1),a=$.map(function(e,a){var u=a===$.length-1?e:e+t[a];return Number.parseFloat((u/r).toFixed(4))});return a.every(function(e){return e===a[0]})?{index:a.length-1,value:a[0]}:a.reduce(function(e,r,$){return r<e.value?{index:$,value:r}:e},{index:0,value:1})};c.default=q;var d={},r=d&&d.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(d,"__esModule",{value:!0});var s=r(c);self.onmessage=function(e){self.postMessage(s.default(e.data))};if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=d}else if(typeof define==="function"&&define.amd){define(function(){return d})}})();`,
                    data: [
                        [0, 0, 1, 0],
                        [0, 1, 0, 0],
                        [0, 0, 0, 1],
                        [1, 0, 0, 0],
                        [1, 0, 0, 0],
                        [1, 0, 0, 0],
                        [1, 0, 0, 0],
                        [0, 0, 1, 0],
                        [0, 1, 0, 0],
                    ],
                })
            ),
        10000
    )
})
