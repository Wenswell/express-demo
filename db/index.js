const path = require('path')
const sqlite3 = require('sqlite3').verbose()

// 指定数据库文件位置
const db = new sqlite3.Database(path.join(__dirname, './test-2023-06-15-19-42.sqlite3'))
// const db = new sqlite3.Database('./test-2023-06-15-19-42.sqlite3')

module.exports = {db}