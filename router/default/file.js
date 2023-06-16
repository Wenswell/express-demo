const router = require('express').Router()
const fs = require('fs')

// 上传文件
router.post('/upload', (req, res) => {
  // 获取所有上传的文件
  const files = req.files

  if (!files) {
    res.send({
      code: 400,
      msg: "上传文件不能为空"
    })
    return
  }

  const fileNameList = []

  // 遍历所有文件
  files.forEach(file => {

    // 获取文件名和后缀
    const lastDotIndex = file.originalname.lastIndexOf('.');
    // const filename = file.originalname.substring(0, lastDotIndex);
    const ext = file.originalname.substring(lastDotIndex + 1);

    // 使用时间戳作为新文件名      
    const newFilename = Date.now() + '.' + ext;

    // 移动并修改文件名
    fs.renameSync(
      process.cwd() + '/public/upload/temp/' + file.filename,
      process.cwd() + '/public/upload/' + newFilename
    )

    // 收集文件名用于返回
    fileNameList.push(`/public/upload/${newFilename}`)

    // 保存文件时使用新文件名    
    // file.mv(`files/${newFilename}`, err => {
    //   res.status(500).send(err);
    // })
  })

  res.send({
    code: 200,
    msg: "ok",
    data: fileNameList,
  })

})

// 下载文件
router.get('/download', async (req, res) => {
  // 获取查询参数中的文件名
  const fileName = req.query.fileName;
  // 构建文件的完整路径
  const filePath = `${process.cwd()}/public/upload/${fileName}`;
  // 使用 res.download() 方法发送文件给客户端进行下载
  res.download(filePath);
  // .download 完整方法：
  // res.download(filePath, 'img.png', err=>{
  //   if(err){
  //     // 处理错误
  //   } else {
  //     // 下载成功后执行，比如扣除积分
  //   }
});


// 导出路由 
module.exports = router