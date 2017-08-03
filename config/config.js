//链接数据库
var mysql = require('mysql');
module.exports.conn = mysql.createConnection({
    host: '101.200.62.18',
    user: 'root',
    password: '',
    database:'blog-world',
    port: 3306
});
