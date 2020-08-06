const express = require('express')
const app = express()
const formidable = require('formidable')
const fs = require('fs')
const mime = require('mime-types')
const { MongoClient } = require('mongodb')
const port = 3000

// db info
const mongoURL = process.env.MONGO_DB_URL
const mognoClient = new MongoClient(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
var wpDb

const uploadsDir = process.env.WAIFUPASTE_UPLOADS_DIR

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
})

app.get('/:name', (req, res) => {
  wpDb.then(mango => {
    var wpItems = mango.db().collection('uploads-dev')
    wpItems.findOne({name: req.params.name}).then((item, err) => {
      console.log(req.params.name)
      if (err) {
        res.send('Error')
      }
      if (item === null) {
        res.send('item not found')
        return
      }
      if (item.type === 'url') {
        res.send(`you're going to ${item.value}`)
      } else {
        res.send(`this be a file with hash ${item.value}`)
      }
    })
  })
})

app.post('/paste', (req, res) => {
  new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
      // console.log('Field', name, field)
    })
    .on('file', (name, file) => {
      // console.log(file)
      console.log(file.name)
      console.log(mime.lookup(file.name))
      console.log(mime.contentType(file.name))
      console.log(mime.extension(mime.contentType(file.name)))
      // generate file name
      var diskFileName = `${Math.random().toString(36).substr(7)}.${mime.extension(mime.contentType(file.name))}`
      console.log(diskFileName)

      // fs.rename(file.path, `/tmp/${Math.random().toString(36).substring(7)}.${mime.extension(file[1].type)}`, err => {
      //   if(err){
      //     return console.log(err)
      //   }
      //   console.log('File saved!')
      // })
    })
    .on('aborted', () => {
      console.error('Request aborted by the user')
    })
    .on('error', (err) => {
      console.error('Error', err)
      throw err
    })
    .on('end', () => {
      res.end()
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  // start up the database
  wpDb = mognoClient.connect()
})