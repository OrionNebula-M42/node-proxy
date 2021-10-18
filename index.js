

//代理
const http = require('http');
const request = require('request');


let express = require('express');
let app = express();
var multiparty = require( "multiparty" )

const hostIp = '127.0.0.1';
const apiPort = 3008;
const imgPort = 8071;


const apiServer = http.createServer((req, res) => {
    if(!req.url.endsWith('.json') && !req.url.endsWith('.js')) {
        const url = 'http://dev.biqinghao.com' + req.url        
        function callback(error, response, body) {
            if (!error && response.statusCode === 200) {
                //编码类型
                res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
                //允许跨域
                res.setHeader('Access-Control-Allow-Origin', '*');

                //返回代理内容
                console.log('返回代理内容body=',body)
                res.end(body)
            }
        }
        if(req.method === 'GET') {
            const options = {
                url: url,
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded",
                    "debug": true,
                },
            }
            request.get(options, callback);
        }else {     
            let from_data = new multiparty.Form()
            from_data.parse(req)
            let params = null
            req.on("data",(d) => {
                params = d
                // let buf = Buffer.from(d)
                // params = d.toString()
                // console.log('参数=',d.toString())
                console.log('参数=',d)
                let jsstr = JSON.stringify(d);
                let jsondata = JSON.parse(jsstr);
                let buf = Buffer(jsondata);
                let data = buf.toString();
                sx = JSON.parse(data);
                console.log('参数 sx=',sx)
            })       
           
            
            // console.log(sx['peer_count']);



            from_data.on("part",async part=>{         
                console.log('part=',part)    
                // if(part.filename)
                // {  
                //     // 保存文件
                //     let w = fs.createWriteStream(TarName)
                //     part.pipe(w)
                // }           
            })           


            const options = {
                url: url,
                headers:{
                    "Content-Type": 'multipart/form-data',
                    // "Content-Type": "application/x-www-form-urlencoded",
                    "debug": true,
                },
                body: params
            }
            request.post(options, callback);
        }
        
        
    }
    
})


//监听 API 端口
apiServer.listen(apiPort, hostIp, () => {
    console.log('代理接口，运行于 http://' + hostIp + ':' + apiPort + '/');
});
