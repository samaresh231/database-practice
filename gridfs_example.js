const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
const {GridFsStorage} = require('multer-gridfs-storage');

const app = express();

mongoose.connect('mongodb://localhost/gridfs', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

let gfs;

const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    console.log('connected to database')
});

const storage = new GridFsStorage({
    url: 'mongodb://localhost/gridfs',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    res.status(200).json({
        message: 'successful'
    })
}, (error, req, res) => {
    res.status(404).json({
        message: error.message
    })
});

app.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
    
        // Files exist
        return res.json(files);
    });
});

// app.get('/files/:filename', (req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         //Check if file
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//                 err: 'No file exists'
//             });
//         }
//         //File exists
//         return res.json(file);
//     });
// });

app.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    });
  });

app.listen(8000, () => {
    console.log('server listening on port 8000')
})