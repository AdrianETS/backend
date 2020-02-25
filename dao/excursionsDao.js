'use strict'

var MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

var uri = "mongodb://localhost:27017/";

function getAllexcursions() {
    return new Promise((resolve, reject) => {
      const client = new MongoClient(uri, { useUnifiedTopology: true });
  
      client.connect().then((client) => {
        var db = client.db('mountaineering_club')
  
        db.collection('excursions').find().toArray(function (err, result) {
          if (err) throw err;
          resolve(result)
        })
      })
    })
  }

  function getExcursionById(id) {
    return new Promise((resolve, reject) => {
      const client = new MongoClient(uri, { useUnifiedTopology: true });
  
      client.connect().then((client) => {
        var db = client.db('mountaineering_club');
  
        db.collection('excursions').findOne({ _id: ObjectID(id) }, function (err, result) {
          if (err) throw err;
          resolve(result);
        })
      })
    })
  }

function addExcursion(excursion){
    return new Promise((resolve, reject) =>{
      const client = new MongoClient(uri, { useUnifiedTopology: true });
  
      client.connect().then((client) => {
        var db = client.db('mountaineering_club');
        excursion._id = ObjectID(excursion._id);
        excursion.date = new Date(excursion.date);
        excursion.users_id = excursion.users_id.map(id => ObjectID(id));
        db.collection('excursions').insertOne((excursion), function (err, result) {
          if (err) throw err;
          resolve(result);
        })
      })
    })
  }


  function editExcursion(excursion){
    return new Promise((resolve, reject) =>{
      const client = new MongoClient(uri, { useUnifiedTopology: true });
  
      client.connect().then((client) => {
        var db = client.db('mountaineering_club');
        excursion._id = ObjectID(excursion._id);
        excursion.date = new Date(excursion.date);
        excursion.users_id = excursion.users_id.map(id => ObjectID(id));
        db.collection('excursions').updateOne({_id: excursion._id}, {$set: excursion}, function (err, result) {
          if (err) throw err;
          resolve(result);
        })
      })
    })
  }

  function deleteExcursion(id){
    return new Promise((resolve, reject) => {
      const client = new MongoClient(uri, { useUnifiedTopology: true });
  
      client.connect().then((client) => {
        var db = client.db('mountaineering_club');
  
        db.collection('excursions').deleteOne( { _id: ObjectID(id) }, function (err, result) {
          if (err) throw err;
          resolve(result);
        })
      })
    })
  }

  module.exports = {addExcursion, editExcursion, deleteExcursion, getAllexcursions, getExcursionById}