const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Change <USERNAME> , <PASSWORD> & <DATABASE>
const uri = "mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.iohsv.mongodb.net/<DATABASE>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



// Add Database Name in <DATABASE> & Collection Name <COLLECTION> Field
client.connect(err => {
  const collection = client.db("<DATABASE>").collection("<COLLECTION>");

  app.get("/products", (req,res) => {
    collection.find({})
    .toArray((err,documents) => {
      res.send(documents);
    })
  });

  app.post("/addProduct", (req, res) => {
    const product = req.body;

    collection.insertOne(product)
    .then(result => {
      console.log('Product inserted');
      res.redirect('/');
      // res.sendFile(__dirname + '/index.html');
    });

  });

  app.get("/product/:id", (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  });

  app.patch("/updateProduct/:id", (req, res) => {    
    collection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: { name: req.body.name, quantity: req.body.quantity, price: req.body.price }
    }
    ).then(result => {
      res.send(result.modifiedCount > 0 );
    })
  });

  app.delete("/deleteProduct/:id", (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
        res.send(result.deletedCount > 0 );
    })
  });
  


  //client.close();
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});