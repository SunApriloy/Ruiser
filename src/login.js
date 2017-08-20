var http=require('http');
var crypto=require('crypto');
var qs=require('querystring');
var path=require('path');
var fs=require('fs');

var res_tmp;
var data={
  username:'',
  password:'',//从睿思源码看到对用户密码进行了MD5加密
  quickforward:'yes',
  handlekey:'ls',
}

//请求参数设置，表单请求content-type必须设置，否则出错
var options={
  hostname:'rs.xidian.edu.cn',
  path:'/',
  method:'GET',
  port:80,
  headers:{
    'cookie':'',
    'content-type':'',
    'content-length':''
  }
}

function sendGetRequest(){
  http.get(options,(res)=>{
    console.log(res['set-cookie']);
  })
}
//模拟睿思用户请求登陆
function sendLoginRequest(){
  //设置请求参数，包括路径、类型等信息
  options.method='POST';
  options.path='/member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes&inajax=1';
  options.headers['content-length']=qs.stringify(data).length;
  options.headers['content-type']='application/x-www-form-urlencoded';
  
  //console.log('格式化',qs.stringify(data))
  //console.log('长度',qs.stringify(data).length)
  
  //发送请求,处理响应
  var req=http.request(options,(res)=>{
    console.log(`statusCode:${res.statusCode}`);
    res.setEncoding('utf8');
    console.log('content-type:'+res.headers['content-type']);
    var html='';
    res.on('data',chunk=>html+=chunk);
    res.on('end',()=>{
      res_tmp.setHeader('Set-Cookie',res.headers['set-cookie']);
      res_tmp.setHeader('Location','/show');
      res_tmp.writeHead(302,{'Content-Type':'text/html'});
      res_tmp.end();
      //fs.createReadStream('app/show.html').pipe(res_tmp);
    })
  });
  //发送报文数据,表单登录必须
  req.write(qs.stringify(data));
  req.end();
}

//md5加密
function pwmd5(str){
  str=str||'error'
  var md5=crypto.createHash('md5');
  var str2md5=md5.update(str).digest('hex');
  return str2md5;
}

exports.main=function(req,res){
  var loginObj=qs.parse(req.rawBody);
  //console.log('req:'+req.rawBody);
  //console.log(loginObj);
  data.username=loginObj.user;
  data.password=pwmd5(loginObj.pass);
  //console.log('data',data)
  res_tmp=res;
  sendLoginRequest();
}