const router = require('express').Router()
const { db } = require('../../db')
const { Snowflake } = require('nodejs-snowflake')
const uid = new Snowflake({
  // custom_epoch: number, // Defaults to Date.now(). This is UNIX timestamp in ms
  instance_id: 1 // A value ranging between 0 - 4095. If not provided then a random value will be used
})

// 测试用
router.get('/test', (req, res) => {
  const sql = 'SELECT * FROM `msg_board`';
  db.all(sql, [], (err, rows) => {
    if (err) res.status(500).send(err.message)
    else res.send(rows)
  });
});

// 写入评论
router.post('/add', (req, res) => {
  const addMsgSql = `
    INSERT INTO \`msg_board\` (
      \`id\`, 
      \`title\`, 
      \`content\`, 
      \`creat_time\`
    ) VALUES (?,?,?,?)
  `;

  const id = Number(uid.getUniqueID())
  console.log("id", id)

  const newMsg = [
    id,
    req.body.title?req.body.title:'_No Title_',
    req.body.content,
    new Date()
  ];

  console.log("newMsg", newMsg)
  db.run(addMsgSql, newMsg, (err, rows) => {
    if (err) {
      res.status(500).send('添加失败，' + err.message);
    } else {
      res.send({
        code: 200,
        message: '评论添加成功'
      })
    }
  })
})


// 删除评论
router.delete('/del', (req, res) => {
  const deleteId = req.query.id
  const deleteMsgSql = 'DELETE FROM `msg_board` WHERE `id` = ?';
  db.all(deleteMsgSql, [deleteId], (err, rows) => {
    if (err) {
      res.status(500).send('删除失败' + err.message);
    } else {
      res.send({
        code: 200,
        message: '删除成功'
      });
    }
  });
});


// 获取评论
router.get('/get', (req, res) => {
  const sql = 'SELECT * FROM `msg_board`';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send(rows);
    }
  });
});


// 导出路由 
module.exports = router