var path = require('path');
var bodyParser = require("body-parser"); //用于解析客户端请求的body中的内容,内部使用JSON编码处理,url编码处理以及对于文件的上传处理.
var ueditor = require("ueditor");//百度富文本编辑器
var cookieParser = require('cookie-parser');//cookie
var m = require('../build/module')

module.exports.routes = function(app,express){
  app.set('views', './views/default')
  app.set('view engine','ejs')//ejs模板
  app.use(bodyParser.urlencoded({ extended: false }));//用于post请求
  app.use(bodyParser.json());
  app.use(cookieParser());//cookie
  app.use("ueditor/ueditor", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
      // ueditor 客户发起上传图片请求
      if (req.query.action === 'uploadimage') {
          var foo = req.ueditor;
          var imgname = req.ueditor.filename;
          var img_url = '../upload/images/';
          //你只要输入要保存的地址 。保存操作交给ueditor来做
          res.ue_up(img_url);
      }
      //  客户端发起图片列表请求
      else if (req.query.action === 'listimage') {
          var dir_url = '/images/ueditor/';
          // 客户端会列出 dir_url 目录下的所有图片
          res.ue_list(dir_url);
      }
      // 客户端发起其它请求
      else {
          res.setHeader('Content-Type', 'application/json');
          res.redirect('/ueditor/nodejs/config.json');
      }
  }));


// 使用 cookieParser 中间件，cookieParser(secret, options)
// 其中 secret 用来加密 cookie 字符串（下面会提到 signedCookies）
// options 传入上面介绍的 cookie 可选参数




  //首页
  app.get('/',function(req,res){
    m.main.getIndex(req,res);
  })

  //首页
  app.get('/index',function(req,res){
    m.main.getIndex(req,res);
  })

  //用户首页
  app.get('/:id',function(req,res){
    m.main.getUserIndex(req,res)
  })

  //用户首页
  app.get('/:id/index',function(req,res){
    m.main.getUserIndex(req,res)
  })

  //用户列表
  app.get('/:id/list',function(req,res){
    m.main.getUserList(req,res)
  })

  //用户文章详情
  app.get('/:id/article',function(req,res){
    m.main.getUserArticle(req,res)
  })

  //login
  app.get('/login',function(req,res){
    res.render('login',{});
  })

  app.get('/article', function(req, res){
    var article_id = req.query.id;
    conn.query('SELECT * FROM article where id=' + article_id, function(err, rows, fields) {
    if (err) throw err;
      var article = forTimearry(rows);
      conn.query('SELECT name FROM user', function(err, rows, fields) {
      if (err) throw err;
        res.render('layout',{
          article:article,
          name:rows[0].name,
          title:rows[0].title,
          flag:'article'
        })
      });
    });
  });

  //post login
  app.post('/login',function(req,res){
    conn.query('select password,id from user where email = "' + req.body.username + '" ',function(err,rows,fields){
        if(err){
            res.send({success:'错了'});
        }
        if(rows.length){
           if(rows[0].password == req.body.password){
              res.cookie('userid', rows[0].id, {maxAge: 60 * 10000});
              res.send({success:true});
           }else{
              res.send({success:false});
           }
        }else{
            res.send({success:false});
        }
    });
  });

  //admin
  app.get('/admin',function(req,res){
    if(isSession(req,res)){
      conn.query('select name from user',function(err,rows,fields){
        if(err) throw err;
        res.render('admin/layout',{
          name:rows[0].name,
          title:'博客视界-后台管理系统',
          flag:'write'
        })
      })
    }
  })

  //admin
  app.get('/write',function(req,res){
    if(isSession(req,res)){
      conn.query('select name from user where id = \'' + req.cookies.userid + '\'',function(err,rows,fields){
        if(err) throw err;
        res.render('admin/layout',{
          name:rows[0].name,
          title:'博客视界-后台管理系统',
          flag:'write'
        })
      })
    }
  })

  //mylist
  app.get('/mylist',function(req,res){
    var _title = '博客视界-文章列表';
    conn.query('SELECT * FROM article where autherid =\'' + req.cookies.userid + '\' order by id desc limit 0,10', function(err, rows, fields) {
    if (err) throw err;
      var article = forTimearry(rows);
      var introduction = delHtmlTag(article);
      conn.query('SELECT name FROM user', function(err, rows, fields) {
      if (err) throw err;
        res.render('admin/layout',{
          article:article,
          introduction:introduction,
          name:rows[0].name,
          title:_title,
          flag:'list'
        })
      });
    });
  })

    //bglist
  app.get('/bglist',function(req,res){
    var _title = '文章列表';
    conn.query('SELECT * FROM article order by id desc limit 0,10', function(err, rows, fields) {
    if (err) throw err;
      var article = forTimearry(rows);
      conn.query('SELECT name FROM user', function(err, rows, fields) {
      if (err) throw err;
        res.render('admin/layout',{
          article:article,
          name:rows[0].name,
          title:_title,
          flag:'bglist'
        })
      });
    });
  })

  //接受并且返回发表文章内容
  app.post('/createarticle',function(req,res){
    var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
     conn.query('SELECT * FROM article order by id desc limit 0,10', function(err, rows, fields) {
        if (err) throw err;
     conn.query('insert into article (`title`, `auther`, `article`, `createtime`, `deleteflag`, `autherid`) VALUES ( \'' + req.body.title + '\', \'' + req.body.writer + '\', \'' + req.body.content + '\', \'' + date + '\', 1, \'' + req.cookies.userid + '\')',function(err,result){
      if(err){
        res.send({success:false});
        return;
      }else{
        res.send({success:true});
        return;
      }
    });
   });
  });
}



//验证session
function isSession(req,res){
  // 如果请求中的 cookie 存在 isVisit, 则输出 cookie
  // 否则，设置 cookie 字段 isVisit, 并设置过期时间为1分钟
  if (req.cookies.userid) {
    return true;
  } else {
    res.render('login',{});
    return false;
  }
}
