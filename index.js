const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000 ;
const cors = require('cors')
const ObjectId = require('mongodb').ObjectID;
app.use(cors())
app.use(express.json())
const { MongoClient } = require('mongodb');
const { ObjectID } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xbjez.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
      try{
         await client.connect();
         const database = client.db('Times_World')
         const productCollection = database.collection('products')
         const orderCollection = database.collection('Orders')
         const reviewCollection = database.collection('reviews')
         const usersCollection = database.collection('users')

         app.get('/products', async (req, res)=>{
             const result =  productCollection.find({});
             const products = await result.toArray();

             res.json(products)
         })

         app.post('/products', async(req, res)=>{
             const product = req.body;
             const result = await productCollection.insertOne(product)
             res.json(result)
         })

         app.get('/products/:id', async (req, res)=>{
             const id = req.params.id;
             const query = {_id: ObjectId(id)}
             const result = await productCollection.findOne(query)
             res.json(result)
         })

         app.delete('/products/:id' , async (req, res)=>{
             const id = req.params.id;
             const query = {_id : ObjectID(id)};
             const result = await productCollection.deleteOne(query)
             res.json(result)
         })

         app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result )
        })
        app.get('/orders', async (req, res)=>{
            const result = orderCollection.find({});
            const orders = await result.toArray();
            res.send(orders)
        }) 

       app.get('/orders/:email', async (req, res) =>{
           const email = req.params.email;
           const query = {email} ;
           console.log(query)
           const cursor =  orderCollection.find(query)
           const result = await cursor.toArray();
           res.json(result)
       } ) 

       app.get('/order/:id', async(req, res)=>{
           const id = req.params.id;
           const query = {_id: ObjectID(id)}
           const result = await orderCollection.findOne(query)
           res.json(result)
       })
       app.get('/reviews', async(req, res)=>{
           const result =  reviewCollection.find({});
           const reviews = await result.toArray();
           res.json(reviews)
       }) 
       app.post('/reviews' , async(req, res)=>{
           const cursor = req.body;
           const result = await reviewCollection.insertOne(cursor)
           res.json(result)
       })

       app.delete('/order/:id', async (req, res)=>{
           const id = req.params.id;
           const query = {_id: ObjectID(id)};
           const result = await orderCollection.deleteOne(query)
           res.json(result)
       })  

       app.post('/users', async(req, res)=>{
           const cursor = req.body;
           const user = await usersCollection.insertOne(cursor)
           res.json(user)

       })

       app.get('/users', async ( req, res) =>{
           const cursor = usersCollection.find({});
           const result = await cursor.toArray();
           res.json(result)

       }) 

       app.get('/users/:email', async (req, res) =>{
           let isAdmin = false;
           const email = req.params.email;
           const query = {email: email}
           const result = await usersCollection.findOne(query)
           if(result.role)
           {
               isAdmin = true;
           }
           
           res.json({admin: isAdmin})
       })
       app.put('/users', async ( req, res) =>{
           const user = req.body;
           console.log(user)
           const filter = {email: user.email}
           const options = { upsert : true}
           const updateDoc = {$set: user};
           const result = await usersCollection.updateOne(filter, updateDoc, options);
           res.json(result)

       }) 

       app.put('/users/admin', async ( req, res) =>{
           const user = req.body;
           const filter = {email: user.email}
           const updateDoc = {$set:{ role:"admin"}}
           const result = await usersCollection.updateOne(filter, updateDoc)
           res.json(result)

       })

       app.put('/orders/:id', async(req, res)=>{
           const id = req.params.id;
           const filter = {_id : ObjectID(id)}
           const updateDoc = {$set: {status : 'shipped'}}
           const result = await orderCollection.updateOne(filter, updateDoc)
           res.json(result)
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