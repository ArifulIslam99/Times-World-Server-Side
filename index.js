const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000 ;
const cors = require('cors')
app.use(cors())
app.use(express.json())
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xbjez.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
      try{
         await client.connect();
         const database = client.db('Times_World')
         const productCollection = database.collection('products')

         app.get('/products', async (req, res)=>{
             const result =  productCollection.find({});
             const products = await result.toArray();

             res.json(products)
         })
         
      }
      finally{
        //  await client.close();
      }
}
run().catch(console.dir)

console.log(uri)

app.get('/', (req, res) => {
    res.send("Server is Running")
})

app.listen(port, ()=>{
    console.log("Listening From", port)
} )