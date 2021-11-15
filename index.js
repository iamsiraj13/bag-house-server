const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()
const app = express();
const ObjectId = require('mongodb').ObjectId;

// middleware
app.use(cors());
app.use(express.json())


//database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4tdkj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect()
        const database = client.db('bag_house')

        const produts = database.collection('products');
        const orders = database.collection('orders');
        const reviews = database.collection('reviews');
        const newUsers = database.collection('newUsers');


        // add products api
        app.post('/add_product', async (req, res) => {
            const newProduct = req.body;
            const result = produts.insertOne(newProduct);
            res.json(result)
        })

        // get All products 
        app.get('/add_product', async (req, res) => {
            const result = await produts.find({}).toArray();
            res.json(result)
        })

        // get signle 
        app.get('/singleProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id)}
            const result = await produts.findOne(query);
            res.json(result)
        })
        // post your order
        app.post('/placeOrder', async(req,res)=>{
            const order = req.body;
            const result = await orders.insertOne(order);
            res.json(result)

        })
        // get your order
        app.get('/placeOrder', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await orders.find(query).toArray();
            res.json(result)
        })

        // delete order 
        app.delete('/deleteOrder/:id', async( req, res )=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await orders.deleteOne(query)
            res.json(result)

        })


        // add Review
        app.post('/add_review', async (req, res) => {
            const newReview = req.body;
            const result = await reviews.insertOne(newReview);
            res.json(result)
        })

        // get All reviews 
        app.get('/add_review', async (req, res) => {
            const result = await reviews.find({}).toArray();
            res.json(result)
        })


        app.get('/user/:email', async( req, res )=>{
            const email = req.params.email;
            const query = { email:email};
            const user = await newUsers.findOne(query)
            let isAdmin = false;
            if( user?.role == 'admin'){
                isAdmin = true;
            }
            res.json({ admin: isAdmin})
        })

        app.post('/user', async( req, res )=>{
            const user = req.body; 
            const result = await newUsers.insertOne(user);
            res.json(result)
        })

        app.put('/user', async(req,res)=>{
            const user = req.body;
            const query =  { email: user.email}
            const options = {upsert:true} 
            const updateDoc = {
                $set:user
            }
            const result = await newUsers.updateOne(query, updateDoc,options)
            res.json(result)
        })

        app.put( '/user/admin', async( req , res )=>{
            const email = req.body.email;
            const filter = {email: email}
            const updateDoc = {
                $set:{role:'admin'}
            }

            const result = await newUsers.updateOne(filter,updateDoc)

            res.json(result)
        })


    }
    finally {
        //
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(port, () => {
    console.log(`Server Running on ${port}`)
})

// user: bag_house
// pass: OOx4aKEV2ozZ4dzh