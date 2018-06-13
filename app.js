/**
 * Created by mycontent on 2017/7/29.
 */
// 导入express模块,创建 express 类型的Web服务器
var express = require('express');
// 创建 express 的服务器实例
var app = express();
// WebSocket服务器
// var WebSocket = require('ws');
// 基本的NodeWeb服务器
var http = require('http');

// 使用 http 核心模块，创建一个 最基本的 Web 服务器
// 将来，所有的请求（包括普通的HTTP请求 + WebSocket请求）都会先被 baseServer 处理
// 然后，再决定 交给 app 服务器处理还是交给 wss 服务器处理
var baseServer = http.createServer(app);

//创建socket.io服务器
var io = require('socket.io').listen(baseServer);

// 创建一个 WebSocket 服务器，专门用来处理 WebSocket 类型的请求
// var wss = new WebSocket.Server({server:baseServer});

// 导入处理 表单 post 数据的中间件
// var bodyParser = require('body-parser');
// 注册 解析 表单 post 数据的中间件
// 官方推荐 extended: false，表示不使用第三方插件去解析表单数据，而是使用原生的方式去解析表单数据  querystring
// app.use(bodyParser.urlencoded({ extended: false }));

// 设置默认模板引擎
// app.set('view engine','ejs');
// 设置默认的模板文件的存放路径
// app.set('views','./views');

// 把 node_modules,js,css 目录托管为静态资源
app.use('/node_modules',express.static('node_modules'));
app.use('/js',express.static('js'));
app.use('/css',express.static('css'));
//直接将初始的静态页面通过express托管,然后直接发送回客户端
app.use(express.static('views'));

// 1. 导入自定义的路由模块
var router = require('./router.js');
// 将路由注册到 app 上
app.use(router);

//导入model模块,获取所有棋子数据
var model = require('./model.js');



var allSockets = [];
// 每当触发 io 的 connection 事件，表示有客户端连接上来了！
io.sockets.on('connection',function (socket) {
    //通过socket.id可以得到每个客户端的唯一id值
    // console.log(socket.id);
    //保存客户端的唯一id值，可以向指定的客户端发送消息
    allSockets.push({name:socket.id});
    // console.log(allSockets);

    //获取所有棋子数据
    model.getAllChess(function (err,chess) {
        if (err) throw err;
        // console.log(chess);
        var data = {list:chess};
        //向所有客户端发送所有棋子数据,注意这里的格式问题,send中必须传入字符串式的对象
        // client.send(JSON.stringify(data));
        io.sockets.emit('news',data);
    });

    //服务器每当收到客户端的消息时就会触发以下事件
    socket.on('thisChess',function (pos) {
        var posData = JSON.parse(pos);
        // console.log(posData);
        model.saveData(posData,function (err,isOk) {
            if(err) throw err;
            if ( isOk ) {
                //每当服务器收到客户端的消息时,将接受到的数据先保存到data.json文件中,然后再获取到所有棋子数据再发送到所有客户端
                //获取所有棋子数据
                model.getAllChess(function (err,chess) {
                    if (err) throw err;
                    // console.log(chess);
                    var data = {list:chess};
                    //向所有客户端发送所有棋子数据,注意这里的格式问题,send中必须传入字符串式的对象
                    // client.send(JSON.stringify(data));
                    io.sockets.emit('news',data);
                });
            }
        })
    });

    //当收到一方胜出的信息后，向所有客户端发送游戏结束的信息
    socket.on('win',function (msg) {
        io.sockets.emit('gameover',{"msg":msg});
    });

    //当收到重新开始的信息后，清除所有数据
    socket.on('restart',function (data) {
        model.deleteChess(function (err,isOk) {
            if (err) throw err;
            io.sockets.emit('restart',{"msg":"restart"})
        });
    });

    //改变棋子颜色的信息接收到后再通知客户端改变下一个棋子颜色
    socket.on('changeColor',function (data) {
        var other = [];
        allSockets.map(function (item) {
            if ( item.name!=socket.id ) {
                other = item;
                return other;
            }
        });
        io.sockets.emit('newColor',{"msg":other.name})
    });

    //让当前下的棋子高亮显示
    socket.on('heightColor',function (data) {
        io.sockets.emit('addColor',data);
    })

})


// 调用 app.listen 方法，指定端口号并启动web服务器
baseServer.listen(9000,function () {
    console.log('http://127.0.0.1:9000');
    // console.log('http://192.168.1.104:9000');
})




