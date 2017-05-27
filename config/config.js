//链接数据库
var mysql = require('mysql');
module.exports.conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'daimingru',
    database:'blog-world',
    port: 3306
});
