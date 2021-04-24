const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID
require('dotenv').config()

const port = process.env.PORT || 5000
// console.log(process.env.DB_USER)

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World...')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rfrum.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err',err)

  const reviewsCollection = client.db("Puppy'sSchool").collection("Reviews");
  const servicesCollection = client.db("Puppy'sSchool").collection("Services");

  app.get('/reviews', (req, res) =>{
    reviewsCollection.find()
    .toArray((err, items) =>{
      res.send(items)
      // console.log('from database', items)
    })
  })

  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log('adding new review', newReview)
    reviewsCollection.insertOne(newReview)
    .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/services', (req, res) =>{
    servicesCollection.find()
    .toArray((err, items) =>{
      res.send(items)
      // console.log('from database', items)
    })
  })

  app.post('/addService', (req,res) => {
    const newService = req.body;
    console.log('adding new service', newService)
    servicesCollection.insertOne(newService)
    .then(result=> {
      console.log('inserted service', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    // console.log('delete this', req.params.id)
    servicesCollection.findOneAndDelete({_id: id})
    .then(result => {
      console.log(result);
     })
  })

  // client.close();
});


app.listen( process.env.PORT || port)