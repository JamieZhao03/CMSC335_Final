const express = require('express');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const app = express();
const PORT = 5000;

const databaseName = process.env.MONGO_DB_NAME;
const collectionName = process.env.MONGO_COLLECTION;
const uri = process.env.MONGO_CONNECTION_STRING;
// console.log('Mongo URI: ', uri);

const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });