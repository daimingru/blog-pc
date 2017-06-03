var comm = require('../config/config.js');
var asyn = require('async');
var moment = require("moment") //处理时间格式
module.exports.main = {

    init: function(){
      this.global = {
        title: '博客视界-blog-world',
        sectitle:'博客列表-blog-world'
      }
      this.connectDatabase();
    },

    //链接数据库
    connectDatabase: function(){
      this.conn = comm.conn;
      this.conn.connect();
    },

    //遍历数组时间
    forTimearry: function (rows){
        for(var i = 0;i<rows.length;i++){
            rows[i].createtime = moment(rows[i].createtime).format("YYYY-MM-DD");
        }
        return rows;
    },

    //匹配html标签
    delHtmlTag: function (str)
    {
        var array = str;
        for(var i = 0;i<array.length;i++){
            array[i].article = array[i].article.replace(/<[^>]+>/g,"");
        }
        return array;
    },

    //首页
    getIndex: function(req,res){
      var _self = this;
      _self.conn.query('SELECT * FROM article order by id desc limit 0,5', function(err, rows, fields) {
      if (err) throw err;
        var article = _self.forTimearry(rows);
        var introduction = _self.delHtmlTag(article);
        _self.conn.query('SELECT name FROM user', function(err, rows, fields) {
        if (err) throw err;
          res.render('layout',{
            article:article,
            introduction:introduction,
            name:rows[0].name,
            title:_self.global.title,
            flag:'index'
          })
        });
      });
    },

    //用户首页
    getUserIndex: function(req,res){
      var _self = this;
      var Sql = [
        'SELECT * FROM article where autherid = ' + req.params.id + ' order by id desc limit 0,10',
        'SELECT name FROM user where id=' + req.params.id
      ]
      var data = [];
      var stad = asyn.eachSeries(Sql, function (item, callback) {
          _self.conn.query(item, function(err, res) {
            if(err) {
              callback(err);
            } else {
              data.push(res);
              callback();
            }
          });
      }, function (err) {
        if(err)
            console.log("err: " + err);
        else
            res.render('layout',{
              article:_self.delHtmlTag(_self.forTimearry(data[0])),
              introduction:_self.delHtmlTag(_self.forTimearry(data[0])),
              name:data[0][0].name,
              title:_self.global.title,
              auther:req.params.id,
              flag:'index'
            })
      });

    },

    //用户文章列表页
    getUserList: function(req,res){
      var _self = this;
      var Sql = [
        'SELECT * FROM article where autherid = ' + req.params.id + ' order by id desc limit 0,10'
      ]
      var data = [];
      var stad = asyn.eachSeries(Sql, function (item, callback) {
          _self.conn.query(item, function(err, res) {
            if(err) {
              callback(err);
            } else {
              data.push(res);
              callback();
            }
          });
      }, function (err) {
        if(err)
            console.log("err: " + err);
        else
            res.render('list',{
              article:_self.delHtmlTag(_self.forTimearry(data[0])),
              introduction:_self.delHtmlTag(_self.forTimearry(data[0])),
              name:data[0][0].name,
              title:_self.global.title,
              auther:req.params.id,
              flag:'list'
            })
      });

    },

    //用户文章详情页
    getUserArticle: function(req,res){
      var _self = this;
      var Sql = [
        'SELECT * FROM article where autherid = ' + req.params.id + ' and id = ' + req.query.id
      ]
      var data = [];
      var stad = asyn.eachSeries(Sql, function (item, callback) {
          _self.conn.query(item, function(err, res) {
            if(err) {
              callback(err);
            } else {
              data.push(res);
              callback();
            }
          });
      }, function (err) {
        if(err)
            console.log("err: " + err);
        else
            res.render('article',{
              article:_self.forTimearry(data[0]),
              introduction:_self.forTimearry(data[0]),
              name:data[0][0].name,
              title:_self.global.title,
              auther:req.params.id,
              flag:'article'
            })
      });

    },

    //列表页
    getList: function(){
      var _title = '博客视界-文章列表';
      conn.query('SELECT * FROM article order by id desc limit 0,10', function(err, rows, fields) {
      if (err) throw err;
        var article = forTimearry(rows);
        var introduction = delHtmlTag(article);
        conn.query('SELECT name FROM user', function(err, rows, fields) {
        if (err) throw err;
          res.render('layout',{
            article:article,
            introduction:introduction,
            name:rows[0].name,
            title:_self.global.title,
            flag:'list'
          })
        });
      });
    },

    //返回数据
    callback: function(data){
      return data;
    }

}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports.main.init();
