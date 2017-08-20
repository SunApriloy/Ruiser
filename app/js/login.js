import '../css/bootstrap.min.css';
import '../css/login.css';

window.onload=function(){
    $('#user').focus();
    $('#user').onblur=function(){
      console.log('blur')
      toggleSuccess($('#user'),$('.form-group'),0);
    }
    $('#pass').onblur=function(){
      console.log('blur')
      toggleSuccess($('#pass'),$('.form-group'),1);
    }
    $('#form').onsubmit=function(e){
      //e.preventDefault();
      if($('#user').value.trim()==''||$('#pass').value.trim()==''){
        console.log(11)
        return false;
      }
    }
  }
  function $(name){
    if(name[0]=='#')return document.querySelector(name);
    else return document.querySelectorAll(name);
  }
  function toggleSuccess(ele,parent,i){
    if(ele.value.trim()==''){
      parent[i].className=parent[i].className.replace('has-success ','')
      if(parent[i].className.indexOf('has-error')>-1)return;
      parent[i].className='has-error '+parent[i].className;
    }else{
      parent[i].className=parent[i].className.replace('has-error ','')
      if(parent[i].className.indexOf('has-success')>-1)return;
      parent[i].className='has-success '+parent[i].className;
    }
  }