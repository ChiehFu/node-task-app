// CRUD 

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const database = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
       return console.log(error);
    }

    const db = client.db(database);

    db.collection('tasks').deleteOne({
        description: '2'
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });;

});