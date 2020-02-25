'use strict'

var MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

var uri = "mongodb://localhost:27017/";

function getAllMembers() {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club')

      db.collection('members').find().toArray(function (err, result) {
        if (err) throw err;
        resolve(result)
      })
    })
  })
}

function getMemberById(id) {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club');

      db.collection('members').findOne({ _id: ObjectID(id) }, function (err, result) {
        if (err) throw err;
        resolve(result);
      })
    })
  })
}

function deleteMember(id){
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club');

      db.collection('members').deleteOne( { _id: ObjectID(id) }, function (err, result) {
        if (err) throw err;
        resolve(result);
      })
    })
  })
}

function addMember(user){
  return new Promise((resolve, reject) =>{
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club');
      //user._id = ObjectID(); not necessary, assigned automatically
      user.birthDate = new Date(user.birthDate);
      db.collection('members').insertOne((user), function (err, result) {
        if (err) throw err;
        resolve(result);
      })
    })
  })
}



function editMember(user){
  return new Promise((resolve, reject) =>{
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club');
      user._id = ObjectID(user._id);
      user.birthDate = new Date(user.birthDate);
      db.collection('members').updateOne({_id: user._id}, {$set: user}, function (err, result) {
        if (err) throw err;
        resolve(result);
      })
    })
  })
}

module.exports = { getAllMembers, getMemberById, addMember, editMember, deleteMember }