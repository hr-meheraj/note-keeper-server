const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { response } = require('express');
const uri = "mongodb+srv://hrmeheraj:hrmeheraj2007@cluster0.cv5my.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
      const database = await client.db("note-keeper");
      const allNotes = await database.collection("allNotes");
     
      // Insert Document => 
     app.post('/note', async(req,res) => {
        const response = await allNotes.insertOne(req.body);
        res.send(response);
     })

     // Get All notes => 
     app.get('/note', async(req,res) => {
      const query = req.query;
      const page = parseInt(query.page);
      const size = parseInt(query.size);

      const response = await allNotes.find().sort({_id:-1}).skip(size * page).limit(size).toArray();
      res.send(response);
     });

     // Total Data count => 
     app.get('/note/count', async(req,res) => {
      const response = await allNotes.estimatedDocumentCount();
      res.send({count : response})
     })
 
     // Delete a specefic note by id => 
     app.delete('/note/:id', async(req,res) =>{
      const query = { _id : ObjectId(req.params.id)}
      const response = await allNotes.deleteOne(query);
      res.send(response);
     });

     //Update a specefic note by id => 
     app.put('/note/:id', async(req,res) => {
        const find = { _id : ObjectId(req.params.id)};
        const options = {upsert : true};
        const updatedDoc = {
          $set : req.body 
        }
        const response = await allNotes.updateOne(find, updatedDoc, options);
        res.send(response);
     });


}  

  run().catch(console.dir);



app.listen(PORT, () => console.log("servier is listening at 5000"));


