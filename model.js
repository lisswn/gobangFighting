/**
 * Created by mycontent on 2017/7/30.
 */

var fs = require('fs');
var path = require('path');

//获取data.json文件中的所有数据
function getAllData(callback) {
    fs.readFile(path.join(__dirname,'./data.json'),'utf-8',function (err,dataStr) {
        if (err) return callback(err);
        var chess = JSON.parse(dataStr);
        callback(null,chess);
    })
}

//向data.json文件中添加新数据
function writeAll(chess,callback) {
    var data = JSON.stringify(chess);
    fs.writeFile(path.join(__dirname,'./data.json'),data,function (err) {
        if (err) return callback(err);
        callback(null,true);
    })
}

module.exports = {
    //获取所有的棋子数据
    getAllChess(callback){
        getAllData(callback);
    },


    //添加保存数据到data.json文件中
    saveData(body,callback){
        //读取 data.json 中所有的棋子数据
        getAllData(function (err,chess) {
            if (err) return callback(err);
            // push 完毕，得到最新的棋子数组，并把这个数组，写入到data.json
            chess.push(body);
            // 调用 writeAll 写入数据，并把 callback 传递进去
            writeAll(chess,callback);
        })
    },

    //当点击重新开始时删除所有数据
    deleteChess(callback){
        getAllData(function (err,chess) {
            if (err) callback(err);
            chess = [];  //直接将棋子数组清空
            writeAll(chess,callback);
        })
    }

}

