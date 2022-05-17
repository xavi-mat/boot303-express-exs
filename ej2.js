////////////////////////////////////////////////////////////////////////////////
// Imports
const express = require("express");
const app = express();
const cors = require("cors");

////////////////////////////////////////////////////////////////////////////////
// Constants
const port = 4000;

////////////////////////////////////////////////////////////////////////////////
// Middlewares
app.use(express.json());
app.use(cors());


////////////////////////////////////////////////////////////////////////////////
// Endpoints

app.get('/', (req, res) => {
    res.send({msg:'welcome'});
});

app.get('/products', (req, res) => {
    res.send({msg:'products list'});
});

app.post('/products', (req, res) => {
    res.send({msg:'Create a product'});
});

app.put('/products', (req, res) => {
    res.send({msg:'Update a product'});
});

app.delete('/products', (req, res) => {
    res.send({msg:'Delete a product'});
});

app.get('/users', (req, res) => {
    res.send({msg:'users list'});
});

app.post('/users', (req, res) => {
    res.send({msg:'Create a user'});
});

app.put('/users', (req, res) => {
    res.send({msg:'Update a user'});
});

app.delete('/users', (req, res) => {
    res.send({msg:'Delete a user'});
});


////////////////////////////////////////////////////////////////////////////////
// Listen
app.listen(port, () => { console.log(`Server up in port ${port}!`); });
