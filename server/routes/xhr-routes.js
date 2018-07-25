const express = require('express');
const router = express.Router();
const fs = require('fs')
const FormData = require('form-data')
const multer = require('multer')

const apiInitializer = require('../api')
const AUTH_MIDDLEWARE = require('../middlewares/auth')
const GUEST_MIDDLEWARE = require('../middlewares/guest')

let api = apiInitializer()

const tmpImageUploadPath = "./static/tmp"
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, tmpImageUploadPath);
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/, ''));
  }
});

const upload = multer({
  storage,
  preservePath: false
})

const errorHandler = (err, req, res, code = 422) => {
  let error
  try {
    error = err.response.data.error || err.response.data.message
  } catch (e) {}

  error = error || err.toString()

  console.log(error)

  return res.status(code).json({
    error
  })
}

router.use(function (req, res, next) {
  if (req.session.user) {
    api = apiInitializer(req.session.user.token)
  }
  next()
})

router.post('/login', GUEST_MIDDLEWARE, (req, res) => {
  api.auth.login({
    email: req.body.email,
    password: req.body.password
  }).then(resp => {
    req.session.user = {
      attributes: resp.data.data.user,
      token: resp.data.data.token.access_token,
    }

    res.status(200).json({
      'status': 'success',
      data: {
        user: req.session.user
      }
    })
  }).catch(err => {
    console.log(err)
    try {
      let error = err.response.data.error || err.response.data.message
      res.status(500).send(error)
    } catch (e) {
      res.status(500).send(err.toString())
    }
  })
});

router.post('/register', GUEST_MIDDLEWARE, (req, res) => {
  api.auth.register({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    password_confirmation: req.body.password_confirmation
  }).then(resp => {
    req.session.user = {
      attributes: resp.data.data.user,
      token: resp.data.data.token.access_token,
    }

    res.status(200).json({
      'status': 'success',
      data: {
        user: req.session.user
      }
    })
  }).catch(err => {
    let errorMessage = err.response.data.error || err.response.data.message
    res.status(500).send(errorMessage)
  })
});

router.get('/images', (req, res) => {
  api.images.getAllUploads(req.body.page, req.body.perpage, req.body.search)
    .then(resp => {
      res.status(200).json({
        status: 'success',
        data: resp.data.data
      })
    })
    .catch(err => {
      let error = err.response.data.error || err.toString()
      return res.status(500).json({
        error
      })
    })
});

router.get('/tags', (req, res) => {
  res.status(200).json(['list tags'])
});

router.get('/tag/:id/images', (req, res) => {
  res.status(200).json(['tag images'])
});

router.get('/images/recent', (req, res) => {
  api.images.getRecentUploads(12)
    .then(resp => {
      res.status(200).json({
        status: 'success',
        data: resp.data.data
      })
    })
    .catch(err => {
      let error = err.response.data.error || err.toString()
      return res.status(500).json({
        error
      })
    })
});

router.get('/user/images', AUTH_MIDDLEWARE, (req, res) => {
  api.images.getUserUploads(1)
    .then(resp => {
      res.status(200).json({
        status: 'success',
        data: resp.data.data
      })
    })
    .catch(err => errorHandler(err, req, res))
});

router.post('/images/upload', AUTH_MIDDLEWARE, (req, res) => {
  let sgUpload = upload.single('image')
  sgUpload(req, res, function (err) {
    if (err) {
      console.log(err.toString())
      return res.status(422).send({
        error: 'Something went wrong!'
      })
    }
    if (!req.file) return res.status(422).json({
      error: 'Please upload a file'
    })

    let name = req.body.name || ('Image ' + (new Date).toLocaleString())
    let file = req.file
    let fileUrl = (() => {
      let dirtyUrl = process.env.APP_URL 
          dirtyUrl += tmpImageUploadPath.replace(/^(\.?.+?\/)(.+)$/gi, '/$2/')
          dirtyUrl += file.filename
          
      return dirtyUrl.replace(/\\+/g, '/')
    })();

    let data = {
      name, 
      image_url: fileUrl
    }

    console.log(data)

    api.images.upload(data)
      .then(resp => {
        res.json({
          status: 'success',
          info: resp.data.info || 'upload success'
        })
      })
      .catch(err => errorHandler(err, req, res))
      .then(() => {
        fs.unlink(file.path, () => {})
      })
  })
})

module.exports = router