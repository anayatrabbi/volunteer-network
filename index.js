const express = require('express')
const app = express()
const cors = require ('cors')
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
app.use(cors());
app.use(express.json());
const port = 5000;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s17y2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
  const eventCollection = client.db("vol-net").collection("events");
  const registrationCollection = client.db("vol-net").collection("registeredMember");

    app.get('/events',(req, res) =>{
        eventCollection.find({})
        .toArray((err, document)=>{
            res.send(document)
        })
    })

    app.get('/event/:id',(req, res) =>{
      const id = req.params.id;
      eventCollection.find({_id: ObjectId(id)})
      .toArray((err, document)=>{
          res.send(document[0])
      })
  })

  app.post('/addEvent', (req, res) =>{
    const event = req.body;
    eventCollection.insertOne(event, (err, result)=>{
      console.log(err, result);
      res.send({count: result});
    })
  })

  app.post('/addRegistration', (req, res) =>{
    const registration = req.body;
    registrationCollection.insertOne(registration, (err, result)=>{
      console.log(err, result);
      res.send({count: result});
    })
  })

  app.get('/registration/:email', (req, res) => {
    const email = req.params.email;
    registrationCollection.find({userEmail: email})
        .toArray((err, documents) => {
            res.send(documents);
        })
})

app.get('/registrations',(req, res) =>{
  registrationCollection.find({})
  .toArray((err, document)=>{
      res.send(document)
  })
})

app.delete('/deleteRegistration/:id', (req, res) => {
  const id = req.params.id;
  registrationCollection.deleteOne({_id: ObjectId(id)}, (err) => {
      if(!err) {
          res.send({count: 1})
      }
  })

})
    // app.post('/addEvents', (req, res) =>{
    //   const events = req.body;
    //   eventCollection.insertMany(events, (err, result)=>{
    //     console.log(err, result);
    //     res.send({count: result});
    //   })
    // })

    app.get('/', (req, res) => {
    res.send('Hello World!')
})

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})