const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000 ;
const cors = require('cors')
const ObjectId = require('mongodb').ObjectID;
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
         const orderCollection = database.collection('Orders')

         app.get('/products', async (req, res)=>{
             const result =  productCollection.find({});
             const products = await result.toArray();

             res.json(products)
         })

         app.get('/products/:id', async (req, res)=>{
             const id = req.params.id;
             const query = {_id: ObjectId(id)}
             const result = await productCollection.findOne(query)
             res.send(result)
         })
         
         app.post('/orders', async(req, res)=>{
            const order = req.body;
            console.log(order)
            const result = await orderCollection.insertOne(order);
            res.json(result )
        })
        app.get('/orders', async (req, res)=>{
            const result = orderCollection.find({});
            const orders = await result.toArray();
            res.send(orders)
        })
 
         
      }
      finally{
        //  await client.close();
      }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("Server is Running")
})

app.listen(port, ()=>{
    console.log("Listening From", port)
} )