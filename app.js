var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer=require("multer");
var  cookSession=require("cookie-session");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//cookie-session的配置
//传入是图片设置 storage可以对放入的地址的一个控制
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.url.indexOf('user')!==-1 || req.url.indexOf('reg')!==-1){
      cb(null, path.join(__dirname, 'public','upload','user'))
    }else if(req.url.indexOf('banner')!==-1){
      cb(null, path.join(__dirname, 'public','upload','banner'))
    }else{
      cb(null, path.join(__dirname, 'public/upload/product'))
    }
  }
}) 
let multerobj=multer({storage});//存储的范式
app.use(multerobj.any());
let arr=[];
for(var i=0;i<1000;i++){
  arr.push("wmy_"+Math.random());
}
app.use(cookSession(
  {
    name:"wmy_user",
    keys:["aa","bb","cc"],
    maxAge:1000*60*60*24*15,//半个月的事件cookieseesion

  }
))
// 静态资源的托管的配置
app.use(express.static(path.join(__dirname,"public","template")));
app.use('/admin',express.static(path.join(__dirname,"public","admin")));
app.use(express.static(path.join(__dirname,"public",)));

// 用户端
app.use("/api/*",require("./routes/api/globalParams"));
app.use("/api/home",require("./routes/api/home"));
app.use("/api/banner",require("./routes/api/banner"));
app.use("/api/column",require("./routes/api/column"));
app.use("/api/follow",require("./routes/api/follow"));
app.use("/api/login",require("./routes/api/login"));
app.use("/api/logout",require("./routes/api/logout"));
app.use("/api/reg",require("./routes/api/reg"));
app.use("/api/user",require("./routes/api/user"));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if(req.url.indexOf("/admin")!==-1){
    res.render("error");
 }else{
  res.send({
    err:1,
    msg:"错误的接口或请求方式",
  })
 }

});

module.exports = app;
