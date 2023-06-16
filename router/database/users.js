const router = require('express').Router()
const {db} = require('../../db')
const { Snowflake } = require('nodejs-snowflake')
const uid = new Snowflake({
  // custom_epoch: number, // Defaults to Date.now(). This is UNIX timestamp in ms
  instance_id: 0 // A value ranging between 0 - 4095. If not provided then a random value will be used
})

// 获取用户信息
router.get('/get', (req, res) => {
  // 查询使用 .all 执行查询语句
  db.all('select `id`,`name`,`account`,`creat_time`,`balance` from `user`', [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send(rows);
    }
  })
})

// 添加新用户信息
router.post('/add', (req, res) => {
  const insertSql = `
    INSERT INTO \`user\` (
      \`id\`, 
      \`name\`, 
      \`account\`, 
      \`password\`, 
      \`creat_time\`,
      \`balance\`
    ) VALUES (
      ?,?,?,?,?,?
    )
  `;

  const id = Number(uid.getUniqueID())
  console.log("id", id)

  const userData = [
    id,
    req.body.name,
    req.body.account,
    req.body.password,
    Date.now(),   //creat_time
    500,
  ];
  console.log("userData", userData)

  db.run(insertSql, userData, (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send('插入成功，' + rows)
    }
  })
})


// 删除用户
router.delete('/del', (req, res) => {
  const deleteId = req.query.id
  const deleteMsgSql = 'DELETE FROM `user` WHERE `id` = ?';
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


// 导出路由 
module.exports = router