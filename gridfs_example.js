const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
// const Grid = require('gridfs-stream');
const {GridFsStorage} = require('multer-gridfs-storage');

const app = express();

mongoose.connect('mongodb://localhost/gridfs', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// let gfs;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // gfs = Grid(conn.db, mongoose.mongo);
    // gfs.collection('uploads');
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

app.listen(8000, () => {
    console.log('server listening on port 8000')
})