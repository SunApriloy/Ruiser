var http=require('http');
var cheerio=require('cheerio');
var nodejieba = require("nodejieba");
var fs=require('fs');
var path=require('path');

//nodejieba设置用户词典
nodejieba.load({
  userDict: path.join(__dirname,'./user.utf8'),
});

//请求参数设置
var options={
  hostname:'rs.xidian.edu.cn',
  path:'/home.php?mod=spacecp&ac=plugin&id=bt:history',
  method:'GET',
  port:80,
  headers:{
    'cookie':''
  }
}
//发送请求
function requestURL(options){
  http.request(options,(res)=>{
    var html='';
    res.setEncoding('utf8');//看来不加不行呀，不加偶现乱码
    console.log(`第${cur}次请求statusCode:${res.statusCode}`)
    res.on('data',(chunk)=>{html+=chunk})
    res.on('end',()=>{doWithHTML(html)})
  }).end();
}

var data=[],allpage=1,cur=1,res_tmp,content='';

//处理返回的html数据，提取资源数据，保存至resources中
function doWithHTML(html){
  var $=cheerio.load(html);
  var trs=$('tbody tr','#ct');
  //对可能出的错误处理
  try{
    //提取页面总数信息，以请求所有页面
    allpage=$('.pg label span','#ct').text().match(/\w+/)[0];
  }catch(e){
    res_tmp.writeHead(404);
    res_tmp.end('error');
    console.log('error:'+e.message)
    return ;
  }
  
  //提取种子信息，将类型日期信息保存至data，资源信息保存至content，以进行关键词提取
  trs.each(function(i, elem) {
    if(i==0)return;
    var text=$(elem).children().first().text()
    var type=text.slice(text.indexOf('[')+1,text.indexOf(']'))
    //处理一些不规范资源名称
    if(type.indexOf('禁转')>-1)type=text.slice(text.indexOf('[',1)+1,text.indexOf(']',7))
    var date=$(elem).children().last().text();

    //console.log(type)
    //content+=text.slice(text.indexOf('['),findEnd(text))+'\n';
    content+=text.slice(text.indexOf('['))+'\n';
    data.push({type:type,date:date});
    
  });
  //进行下一页面的请求处理，请求完毕后以json格式响应
  cur++;
  if(cur<=allpage){ 
    options.path=options.path+"&page="+cur;
    requestURL(options);
  }else{
    //中文分词
    var result = nodejieba.extract(content, 200);
    
    /* var keywords=[];
    result.forEach(item=>{
      if(/[\u0080-\uffff]/.test(item['word']))
        keywords.push(item['word'])
      }); */
    //过滤出中文关键词
    var keywords=result.filter(item=>/[\u0080-\uffff]/.test(item['word']));  
    //console.log(keywords)
    var json=JSON.stringify({data:data,keywords:keywords});
    //设置缓存期限5分钟
    res_tmp.setHeader('Cache-Control','max-age='+60*5);
    //res_tmp.setHeader('Cache-Control','max-age='+0);

    res_tmp.setHeader('Content-Length',new Buffer(json).length);
    res_tmp.writeHead(200,{'Content-Type':'application/json'});
    
    res_tmp.end(json);
    //res_tmp.end(JSON.stringify({data:data,keywords:keywords}))
    //fs.createWriteStream('content.txt').write(content)
  }
}

//对字符串找到第num个split位置并返回
function findEnd(str,split,num){
  for(var i=0,l=str.length;i<l;i++){
    if(str[i]==split){
      num--;
      if(num==0)return i+1;
    }
  }
  return -1;
}

exports.show=function(req,res){
  res_tmp=res;
  //console.log(req.headers['cookie'])
  
  cur=1;
  data=[];
  options.path=options.path+"&page="+cur;
  //设置cookie
  options.headers.cookie=req.headers['cookie']
  requestURL(options)
}