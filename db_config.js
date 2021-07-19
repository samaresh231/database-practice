const mongoose = require('mongoose')

function dbConnection(db_name) {
    // mongoose connection
    mongoose.connect(`mongodb://localhost/${db_name}`, {useNewUrlParser: true, useUnifiedTopology: true})

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('connected to database')
    });
}

module.exports = dbConnection;