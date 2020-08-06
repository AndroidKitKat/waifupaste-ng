// converts the Legacy SQLite3 Database into Mongo
const { MongoClient } = require('mongodb')
const sqlite3 = require('sqlite3').verbose()
const mongoURL = 'mongodb://10.0.10.0:27017/waifupaste?retryWrites=true&w=majority'
const mognoClient = new MongoClient(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
var devDb

// open the database
let db = new sqlite3.Database('./db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the wp database.');
});

// connect here
devDb = mognoClient.connect()

db.all("SELECT * FROM YldMe", (error, rows) => {
  rows.forEach((row) => {
    // build entry
    var entry = {
      wpId: row.id,
      ctime: row.ctime,
      mtime: row.mtime,
      hits: row.hits,
      type: row.type,
      name: row.name,
      value: row.value,
      legacy: true
    }
    devDb.then(mango => {
      uploadsDb = mango.db().collection('uploads-dev')
      uploadsDb.insertOne(entry)
    })
  })
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});