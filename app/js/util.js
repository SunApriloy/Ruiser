function $(name){
  if(name[0]=='#')return document.querySelector(name);
  else return document.querySelectorAll(name);
}
function addLoadEvent(func){
  var old=window.onload;
  if(typeof old=='function'){
    window.onload=function(){
      old();
      func();
    }
  }else{
    window.onload=func;
  }
}
function addClass(ele,cls){
  var className=ele.className;
  if(!className)return ele.className=cls;
  var reg=new RegExp(cls,'g')
  if(reg.test(className))return;
  ele.className+=' '+cls;
}
function removeClass(ele,cls){
  var className=ele.className;
  if(!className)return ;
  var arr=className.split(' ');
  var index=arr.indexOf(cls),newCls=''
  if(index!=-1)arr.splice(index,1);
  //console.log(className+'\t'+newCls)
  ele.className=arr.join(' ');
}
var EventUtil={
  addEventListener:function(ele,type,handler){
    if(ele.addEventListener){
      ele.addEventListener(type,handler,false);
    }else if(ele.attachEvent){
      ele.attachEvent('on'+type,handler);
    }else{
      ele['on'+type]=handler;
    }
  },
  removeEventListener:function(ele,type,handler){
    if(ele.removeEventListener){
      ele.removeEventListener(type,handler,false);
    }else if(ele.attachEvent){
      ele.detachEvent('on'+type,handler);
    }else{
      ele['on'+type]=null;
    }
  },
  getEvent:function(e){
    return e?e:window.event;
  },
  getTarget:function(e){
    return e.target||e.srcElement;
  },
  preventDefault:function(e){
    if(e.preventDefault)e.preventDefault();
    else e.returnValue=false;
  },
  stopPropagation:function(e){
    if(e.stopPropagation)e.stopPropagation();
    else e.cancelBubble=true;
  }
};
function createXHR(){
  if(typeof XMLHttpRequest != 'undefined'){
    return new XMLHttpRequest();
  }else  if(typeof ActiveXObject!='undefined'){
    if(typeof arguments.callee.activeXString!='string'){
      var version=['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0',
                    'MSXML2.XMLHttp'],i,len;
      for(i=0,len=versions.length;i<len;i++){
        try{
          new ActiveXObject(versions[i]);
          arguments.callee.activeXString=versions[i];
          break;
        }catch(ex){
          
        }
      }
    }
    return new ActiveXObject(argument.callee.activeXString);
  }else{
    throw new Error('No XHR object available.')
  }
}