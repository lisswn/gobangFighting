


// 业务逻辑处理层
var model = require('./model.js');

module.exports = {
    //展示页面
    showIndexPage(req,res){
        model.getAllChess(function (err,chess) {
            //注意:res.send(),res.json()和res.render()是不能同时使用的,用了render就结束响应了
            // res.send(chess);
            // res.json(chess);
            res.render('index',{list:chess});

        })

    },
    //点击后添加数据
    addData(req,res){
        var body = req.body;
        model.saveData(body,function (err,isOk) {
            if (err) throw err;
            if ( isOk ) {
                model.getAllChess(function (err,result) {
                    if (err) throw err;
                    // console.log(result);
                    res.json(result);
                })
            }
        })
    },

    //当点击重新开始时删除所有数据
    deleteData(req,res){
        model.deleteChess(function (err,isOk) {
            if (err) throw err;
            if ( isOk ) {
                res.json('删除成功');
            }
        });
    }

}


