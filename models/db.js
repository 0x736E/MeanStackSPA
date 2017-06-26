const Promise = require('promise');
const mongoose = require('mongoose')

const dbURI = process.env.DBURI || 'mongodb://localhost/todo';
const db = mongoose.connect(dbURI);

mongoose.Promise = Promise;

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to "' + dbURI + '"');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from "' + dbURI + '"');
});

process.on('SIGINT', () => {
    mongoose.connection.close( () => {
        console.log('SIGINT: Mongoose connection terminated from "' + dbURI + '"');
        process.exit(0);
    });
});

module.exports = {
	mongoose: mongoose,
	db: db
}
