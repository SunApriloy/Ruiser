import '../css/show.css';
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入折线图
require('echarts/lib/chart/line');
// 引入雷达图
require('echarts/lib/chart/radar');
// 引入饼图
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/singleAxis');
require('echarts/lib/component/polar');
require('echarts/lib/component/legend');
require('echarts-wordcloud');

var myChart = [];
var charts=Array.prototype.slice.call(document.querySelectorAll('.chart'));
var wordCloud = echarts.init(document.querySelector('#wordCloud'));
//基于准备好的dom，初始化并设置加载动画
charts.forEach((item)=>myChart.push(echarts.init(item)));
myChart.forEach((item)=>item.showLoading());
wordCloud.showLoading();
//Ajax获取数据，异步填充
var response={};
var xhr=createXHR();

xhr.onload=function(){
  if((xhr.status>=200&& xhr.status<300)||xhr.status==304){
      //console.log('date')
      //
      //myChart.hideLoading();
      //console.log(xhr.responseText);
      response=JSON.parse(xhr.responseText);
      
      var typeMap=new Map();//类型统计
      var YearMap=new Map();//年份统计
      var MonthMap=new Map();//月份统计
      var dayMap=new Map();//星期统计
      var dateMap=new Map();//日子统计
      var weekPerYear={};
      var typePerYear={};
      document.body.style.backgroundColor='#E0F8E0';
      response.data.forEach((item)=>{
        //类型统计
        var type=item.type;
        if(typeMap.has(type)){typeMap.set(type,typeMap.get(type)+1)}
        else typeMap.set(type,1);
        
        //提取并统计日期信息
        var time=serilizeDate(item.date);
        
        var month=time.getMonth()+1;
        if(Number.isNaN(month))console.log(item.date)
        if(MonthMap.has(month)){MonthMap.set(month,MonthMap.get(month)+1)}
        else MonthMap.set(month,1);
        
        var year=time.getFullYear();
        if(YearMap.has(year)){YearMap.set(year,YearMap.get(year)+1)}
        else YearMap.set(year,1);
        
        var date=time.getDate();
        if(dateMap.has(date)){dateMap.set(date,dateMap.get(date)+1)}
        else dateMap.set(date,1);
        
        var day=time.getDay();
        if(dayMap.has(day)){dayMap.set(day,dayMap.get(day)+1)}
        else dayMap.set(day,1);
        if(weekPerYear[year]||(weekPerYear[year]=[]))
          weekPerYear[year][day]?weekPerYear[year][day]++:weekPerYear[year][day]=1;
        if(typePerYear[year]||(typePerYear[year]={}))
          typePerYear[year][type]?typePerYear[year][type]++:typePerYear[year][type]=1;
      })
      
      /*console.log(Array.from(typeMap.keys()));
      console.log(Array.from(typeMap.values()));
      console.log(Array.from(typeMap.values()).reduce((pre,cur)=>pre+cur));
      console.log(Array.from(MonthMap.keys()));
      console.log(Array.from(MonthMap.values()));
      console.log(Array.from(MonthMap.values()).reduce((pre,cur)=>pre+cur));*/
      //console.log(weekPerYear)
      //console.log(typePerYear)
      //下载数据类型统计图
      var types=Array.from(typeMap.keys());
      myChart[0].hideLoading();
      myChart[0].setOption({
        title: {
          text: '下载数据类型统计',
          left:'center'
        },
        tooltip: {
          trigger:'item',
          formatter:'{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient:'vertical',
          left:'10%',
          top:'middle',
          data:types
        },
        series: [{
          name: '类型',
          type: 'pie',
          radius:[0,'70%'],
          center:['50%','50%'],
          data: types.map(item=>({
            value:typeMap.get(item),
            name:item
          })),
          itemStyle:{
            emphasis:{
              shadowBlur:10,
              shadowOffsetX:0,
              shadowColor:'rgba(0,0,0,.5)'
            }
          }  
        }]
        
    });
    //下载数据年份统计图
    var years=Array.from(YearMap.keys()).sort();
    myChart[1].hideLoading();
    myChart[1].setOption({
        title: {
            text: '下载数据年份统计',
            left:'center'
        },
        tooltip: {
          trigger:'item',
          formatter:'{b}: {c} ({d}%)'
        },
        legend: {
            orient:'vertical',
            left:'right',
            top:'middle',
            data:years.map(item=>item+'年下载量')
        },
        series: [{
            name: '年份',
            type: 'pie',
            radius:['50%','70%'],
            avoidLabelOverlap:false,
            label:{
              normal:{show:false,position:'center'},
              emphasis:{
                show:true,
                textStyle:{
                  fontSize:'30',
                  fontWeight:'bold'
                }
              }
            },
            labelLine:{
              normal:{show:false}
            },
            data: years.map(item=>({value:YearMap.get(item),name:item+'年下载量'}))
        }]
    });
    //下载数据月份统计图
    var months=[1,2,3,4,5,6,7,8,9,10,11,12];
    myChart[2].hideLoading();
    myChart[2].setOption({
        title: {
            text: '下载数据月份统计',
            left:'center'
        },
        tooltip: {},
        legend: {
            data:['月份'],
            left:'right',
            top:'5%'
        },
        xAxis: {
            data: months
        },
        yAxis: {},
        series: [{
            name: '月份',
            type: 'bar',
            data: months.map(item=>MonthMap.get(item)),
            itemStyle: {
                normal : {
                    color:'#7FAE90'
                }
            },
        }]
    });
    //下载数据星期统计图
    var days=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    myChart[3].hideLoading();
    myChart[3].setOption({
        title: {
            text: '下载数据星期统计',
            left:'center'
        },
        tooltip: {
          trigger:'item',
          formatter:'{a} <br/>{b}: {c} '
        },
        angleAxis:{
          type:'category',
          data:days,
          z:10
        },
        polar:{},
        radiusAxis:{},
        legend:{
          show:true,
          data:['种子下载数'],
          left:'15%',
          top:'10%'
        },
        series: [{
            name: '种子下载数',
            stack:'a',
            type: 'bar',
            itemStyle: {
                normal : {
                    color:'#E98F6F'
                }
            },
            coordinateSystem:'polar',
            data: days.map((item,i)=>dayMap.get(i))
        }]
    });
    //下载数据日期统计图
    var dates=[];
    for(var i=0;i<31;i++){
      dates.push(i+1);
    }
    myChart[4].hideLoading();
    myChart[4].setOption({
        title: {
            text: '下载数据日子统计',
            left:'center'
        },
        tooltip: {},
        legend: {
            data:['日子'],
            left:'right',
            top:'5%'
        },
        xAxis: {
            data: dates
        },
        yAxis: {},
        series: [{
            name: '日子',
            type: 'line',
            data: dates.map(item=>dateMap.get(item))
        }]
    });
    myChart[5].hideLoading();
    myChart[5].setOption({
      title:{
        text:'每年星期下载量统计',
        left:'center'
      },
      tooltip: {
      },
      legend:{
        data:years.map(item=>item+'年下载量'),
        orient:'vertical',
        left:'left',
        top:'middle'
      },
      radar:{
        indicator:days.map((item,i)=>({name:item,max:dayMap.get(i)})),
        name: {
            textStyle: {
                color:'#E98F6F',
                fontSize:'16'
            }, 
        },
      },
      series:[{
        name:'各年每周下载量统计',
        type:'radar',
        itemStyle: {
            emphasis : {
                lineStyle: {
                  width:4
                }
            }
        },
        data:Object.keys(weekPerYear).map((item)=>({
          name:item+'年下载量',
          value:weekPerYear[item]
        }))
      }]
    });
    myChart[6].hideLoading();
    myChart[6].setOption({
      title:{
        text:'每年各类型下载量统计',
        left:'center',
      },
      tooltip: {
        trigger:'item',
        backgroundColor:'rgba(0,0,250,.2)'
      },
      legend:{
        data:types,
        orient:'vertical',
        left:'right',
        top:'middle'
      },
      //visualMap:{color:['red','yellow']},
      radar:{
        indicator:years.map(year=>({text:year+'年',max:Math.max.apply(Math,Object.keys(typePerYear[year]).map(type=>typePerYear[year][type]))})),
        shape: 'circle',
        name: {
            formatter:'【{value}】',
            textStyle: {
                color:'#72ACD1',
                fontSize:'16'
            },
            
        },
        splitArea: {
            areaStyle: {
                color: ['rgba(114, 172, 209, 0.1)',
                'rgba(114, 172, 209, 0.2)', 'rgba(114, 172, 209, 0.4)',
                'rgba(114, 172, 209, 0.6)', 'rgba(114, 172, 209, .8)'],
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
            }
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
            }
        }
      },
      series:[{
        name:'各年每周下载类型统计',
        type:'radar',
        itemStyle: {
                emphasis : {
                    lineStyle: {
                      width:4
                    }
                }
            },
        data:types.map((type)=>({
          name:type,
          value:years.map(year=>typePerYear[year][type]||0)
        }))
      }]
    })
    wordCloud.hideLoading();
    wordCloud.setOption(
      {
        title:{
          text:'下载种子关键词统计',
          left:'center',
        },
        tooltip: {},
        series: [ {
          type: 'wordCloud',
          gridSize: 2,
          sizeRange: [20, 80],
          rotationRange: [-90, 90],
          shape: 'circle',
          width: 1000,
          height: 600,
          drawOutOfBound: true,
          textStyle: {
              normal: {
                  color: function () {
                      return 'rgb(' + [
                          Math.round(Math.random() * 160),
                          Math.round(Math.random() * 160),
                          Math.round(Math.random() * 160)
                      ].join(',') + ')';
                  }
              },
              emphasis: {
                  shadowBlur: 10,
                  shadowColor: '#333'
              }
          },
          data: response.keywords.map(item=>({
            name: item.word,
            value: item.weight
          }))
        }]
      }
    )
  }else{
    console.log('数据获取失败')
  }
};
xhr.onprogress=function(e){
  //console.log(e.loaded/e.total);
  //console.log((100*e.loaded/e.total).toFixed(2)+'%');
  $('#progress').style.width=(100*e.loaded/e.total).toFixed(2)+'%';
}
var url='/source';
xhr.open('get',url,true);
xhr.send(null);
//日期字符串处理函数
function serilizeDate(str){
  var date;
  var time=new Date();
  if(str.indexOf('秒前')>-1){
    time.setSeconds(time.getSeconds()-str.match(/\w+/)[0]);
  }
  else if(str.indexOf('分钟前')>-1){
    time.setMinutes(time.getMinutes()-str.match(/\w+/)[0]);
  }
  else if(str.indexOf('半小时前')>-1){
    time.setHours(time.getHours()-1);
    time.setMinutes(time.getMinutes()+30);
  }
  else if(str.indexOf('小时前')>-1){
    time.setHours(time.getHours()-str.match(/\w+/)[0]);
  }
  else if(str.indexOf('昨天')>-1){
    time.setDate(time.getDate()-1);
    time.setHours(str.slice(3).split(':')[0]);
    time.setMinutes(str.slice(3).split(':')[1]);
  }
  else if(str.indexOf('前天')>-1){
    time.setDate(time.getDate()-2);
    time.setHours(str.slice(3).split(':')[0]);
    time.setMinutes(str.slice(3).split(':')[1]);
  }else if(str.indexOf('天前')>-1){
    time.setDate(time.getDate()-str[0]);
  }else{
    time=new Date(str);
  }
  if(Number.isNaN(time.getMonth()))console.log('NaN:'+str)
  return time;
}

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

function $(name){
  if(name[0]=='#')return document.querySelector(name);
  else return document.querySelectorAll(name);
}