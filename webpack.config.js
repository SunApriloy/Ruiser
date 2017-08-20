const path=require('path')
const HTMLWebpackPlugin=require('html-webpack-plugin')
const CleanWebpackPlugin=require('clean-webpack-plugin')

/* const loginHTMLConfig=new HTMLWebpackPlugin({
  template:path.join(__dirname,'./app/login.html'),
  filename:'login.html',
  inject:'head'
});
const showHTMLConfig=new HTMLWebpackPlugin({
  template:path.join(__dirname,'./app/show.html'),
  filename:'show.html',
  inject:'body'
}); */

module.exports={
  entry:{
    login:'./app/js/login.js',
    show:'./app/js/show.js',
  },
  /*plugins:[
     loginHTMLConfig,
    showHTMLConfig,
    new CleanWebpackPlugin(['build']), 
  ],*/
  module:{
    rules:[{
      test:/\.js$/,
      exclude:/node_modules/,
      loader:'babel-loader'
    }, {
      test:/\.css$/,
      exclude:/node_modules/,
      use:['style-loader','css-loader']
    },{
      test:/\.(jpg|bmp|png|gif)$/,
      exclude:/node_modules/,
      loader:'file-loader?name=img/[hash:8].[name].[ext]'
    },{
    test:/\.(ttf|woff|woff2|otf|svg|eot)$/,
      loader:'url-loader'
    }]
  },
  output:{
    filename:'[name].bundle.js', 
    path:path.resolve(__dirname,'dist')
  }
}