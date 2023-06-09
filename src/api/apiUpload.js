module.exports = (app, container) => {
  const express = require('express')
  const path = require('path')
  const cors = require('cors')
  const multer = require('multer')
  const { verifyToken, verifyTokenCMS } = container.resolve('middleware')
  const FOLDER = process.env.DEST_LOCATION || 'src/uploads'
  app.use(cors())
  app.use('/uploads', express.static(FOLDER))

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, FOLDER || 'uploads')
    },
    filename: (req, file, cb) => {
      console.log('File name', file)
      const ext = path.extname(file.originalname)
      const name = file.originalname.split('.')
      name.pop()
      cb(null, `thithuthpt-${name.join('') || 'img'}-${Date.now()}${ext || '.png'}`)
    }
  })
  const fileFilter = (req, file, cb) => {
    // if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
    cb(null, true)
    // } else {
    //     cb(null, false);
    // }
  }
  const upload = multer({ storage: storage, fileFilter })

  app.get('/download', (req, res) => {
    console.log(req.query.path, FOLDER, req.query.path.indexOf(FOLDER))
    if (req.query.path.indexOf(FOLDER) === 0) {
      return res.download(req.query.path)
    }
    res.status(404).json({})
  })
  app.post('/web/upload', verifyToken, upload.single('file'), (req, res, next) => {
    try {
      console.log('upload complete', req.file)
      return res.status(200).json({
        msg: 'Tải lên thành công.',
        fullPath: path.resolve(req.file.path),
        path: req.file.path,
        filename: req.file.filename
      })
    } catch (error) {
      console.error(error)
      res.status(404).json({})
    }
  })

  app.post('/web/uploadMany', verifyToken, upload.any(), (req, res, next) => {
    try {
      console.log('upload complete', req.files)
      return res.status(200).json({
        msg: 'Tải lên thành công.',
        path: req.files.map(i => i.path)
      })
    } catch (error) {
      console.error(error)
      res.status(404).json({})
    }
  })

  app.post('/cms/upload', verifyTokenCMS, upload.single('file'), (req, res, next) => {
    try {
      console.log('upload complete', req.file)
      return res.status(200).json({
        msg: 'Tải lên thành công.',
        fullPath: path.resolve(req.file.path),
        path: req.file.path,
        filename: req.file.filename
      })
    } catch (error) {
      console.error(error)
      res.status(404).json({})
    }
  })

  app.post('/cms/uploadMany', verifyTokenCMS, upload.any(), (req, res, next) => {
    try {
      console.log('upload complete', req.files)
      return res.status(200).json({
        msg: 'Tải lên thành công.',
        path: req.files.map(i => i.path)
      })
    } catch (error) {
      console.error(error)
      res.status(404).json({})
    }
  })
}
