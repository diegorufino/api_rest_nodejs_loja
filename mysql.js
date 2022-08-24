const mysql = require('mysql2');

var pool = mysql.createPool({
    // "user": process.env.MYSL_USER || 'root',
    // "password":  process.env.MYSL_PASSWORD || 'P@p@o1608',
    // "database": process.env.MYSL_DATABASE || 'db_loja_colaborativa',
    // "host": process.env.MYSL_HOST || 'localhost',
    // "port": process.env.MYSL_PORT || '3306'
    "user": process.env.MYSL_USER || 'espor954_diego',
    "password":  process.env.MYSL_PASSWORD || 'Loj@Col@bor@tiv@',
    "database": process.env.MYSL_DATABASE || 'espor954_loja_colaborativa',
    "host": process.env.MYSL_HOST || 'br510.hostgator.com.br',
    "port": process.env.MYSL_PORT || '3306'
});

exports.pool = pool;