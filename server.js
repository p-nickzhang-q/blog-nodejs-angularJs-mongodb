/*
 * @Author: Administrator
 * @Date:   2017-12-12 14:25:03
 * @Last Modified by:   Administrator
 * @Last Modified time: 2018-01-09 16:32:51
 */
const express = require('express');
const expressStatic = require('express-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodayParser = require('body-parser');
const consolidate = require('consolidate');
const multer = require('multer');
const mysql = require('mysql');

var server = express();
server.listen(8080);


//解析cookie
server.use(cookieParser('asdfjklasdfjl'));


var arr = [];
for (var i = 10; i >= 0; i--) {
    arr.push('keys_' + Math.random());
}

//使用session
server.use(cookieSession({
    name: 'session_id',
    keys: arr,
    maxAge: 20 * 3600 * 1000
}));


//post数据
server.use(bodayParser.urlencoded({ extended: false }));
//接受接送数据
server.use(bodayParser.json());
server.use(multer({ dest: './static/upload/' }).any());

//配置模板引擎

// 输出什么东西
server.set('view engine', 'html');
// 模板文件放在哪，
server.set('views', './web');
// 用哪种模板引擎，
server.engine('html', consolidate.ejs);

//route
server.get('/', function(req, res) {
    res.render('index.html');
});

//url 后面要加‘/’，如果不加，无法识别层级关系，比如 url blog/blogPost, 这里不加‘/’的话识别不到。
server.use('/login/', require('./route/login.js')());
server.use('/blog/', require('./route/blog.js')());
server.use('/comment/', require('./route/comment.js')());

//需要特殊处理的访问放在前面，不然特殊处理的访问也会走到公共访问,就会造成特殊访问不到，因为公共访问里没有对应资源
server.use('/static/', expressStatic('static'));
server.use('/', expressStatic('web'));
