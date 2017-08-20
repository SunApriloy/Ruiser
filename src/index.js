var http=require('http')
var path=require('path')
var fs=require('fs')
var resource=require('./resource.js')
var login=require('./login.js')
var zlib=require('zlib')

var root=path.join(__dirname,'../dist');
var app={};
app.start=function(){
  http.createServer((req,res)=>{
    console.log(`${req.method}:${req.url}`);
    
    if(req.url=='/'){
      res.setHeader('Content-Encoding','gzip');
      res.writeHead(200,{'Content-Type':'text/html'});
      fs.createReadStream(root+'/login.html').pipe(zlib.createGzip()).pipe(res);
      //res.end('hello world!');
    }else if(req.url=='/login'){
      if(req.method=='POST'){
        getRawBody(req,function(req){
          login.main(req,res);
        });
      }else{
        res.setHeader('Content-Encoding','gzip');
        res.writeHead(200,{'Content-Type':'text/html'});
        fs.createReadStream(root+'/login.html').pipe(zlib.createGzip()).pipe(res);
      }
    }else if(req.url=='/show'){
      res.setHeader('Content-Encoding','gzip');
      res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
      fs.createReadStream(root+'/show.html').pipe(zlib.createGzip()).pipe(res);
    }else if(req.url=='/source'){
      if(req.headers['cookie']){
        resource.show(req,res);
      }else{
        res.setHeader('Location','/');
        res.writeHead(302);
        res.end();
      }
      
    }else{
      fs.readFile(root+req.url,(err,file)=>{
        if(err){
          res.writeHead(404,{'Content-Type':'text/plain'});
          res.end('not found');
        }else{
          //let path=__dirname+'/static'+req.url;
          //console.log(path)
          res.setHeader('Content-Encoding','gzip');
          res.writeHead(200);
          fs.createReadStream(root+req.url).pipe(zlib.createGzip()).pipe(res);
          //res.pipe(file)
        }
      })
      
    }
  }).listen(3000);
console.log('server is running in http://localhost:3000');
}

function hasBody(req){
  return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
}
function getRawBody(req,cb){
  if(hasBody(req)){
    var buffers=[];
    req.on('data',(chunk)=>buffers.push(chunk));
    req.on('end',()=>{
      req.rawBody=Buffer.concat(buffers).toString();
      cb(req);
    });
  }else{
    cb(req);
  }
}
module.exports=app;