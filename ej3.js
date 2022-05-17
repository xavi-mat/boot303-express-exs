////////////////////////////////////////////////////////////////////////////////
// Imports
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cositas = require("./cositas.json");

////////////////////////////////////////////////////////////////////////////////
// Constants
const port = 3000;

////////////////////////////////////////////////////////////////////////////////
// Fake BD
let items = require("./fakeDB.json");


////////////////////////////////////////////////////////////////////////////////
// Functions
function dameCositas() {
    return cositas[Math.floor(Math.random() * cositas.length)];
}

function saveFakeDB() {
    const data = JSON.stringify(items, null, 2);
    fs.writeFile("./fakeDB.json", data, (err)=>console.error(err));
}

////////////////////////////////////////////////////////////////////////////////
// Middlewares
app.use(express.json());
app.use(cors());


////////////////////////////////////////////////////////////////////////////////
// Client files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/script', (req, res) => {
    res.set('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname, 'scripts', 'script.js'))
});

////////////////////////////////////////////////////////////////////////////////
// API Endpoints
app.get('/products', (req, res) => {
    res.send({ description: 'Products', items, cositas:dameCositas() });
});

// Crear endpoint para poder crear un producto nuevo
app.post('/products', (req, res) => {
    if (!req.body.name || !req.body.price) {
        res.status(422).send({ msg: 'Fill in all data', cositas:dameCositas() });
    } else {
        const newItem = {
            id: items.length + 1,
            name: req.body.name,
            price: req.body.price
        }
        items.push(newItem);
        saveFakeDB();
        res.status(201).send({ msg: 'Item created', newItem, items, cositas:dameCositas() })
    }
});

// Crear endpoint para poder actualizar un producto
app.put('/products/:id', (req, res) => {

    const results = items.filter(item => item.id === +req.params.id);

    if (results.length > 0) {
        const item = results[0];
        item.name = req.body.name ? req.body.name : item.name;
        item.price = req.body.price ? req.body.price : item.price;
        saveFakeDB();
        res.status(200).send({ msg: 'Item updated', items, cositas:dameCositas() });
    } else {
        res.status(404).send({ msg: 'Product not found', cositas:dameCositas() });
    }
});

// Crear endpoint para poder eliminar un producto
app.delete('/products/:id', (req, res) => {
    const hasItems = items.filter(item => item.id === +req.params.id);

    if (hasItems.length > 0) {
        items = items.filter(item => item.id !== +req.params.id);
        res.send({ msg: 'Item deleted', items, cositas:dameCositas() });
    } else {
        res.send({ msg: 'Product not found', items, cositas:dameCositas() });
    }
});

// Crear filtro por price de producto
// Crear filtro que muestre los productos con un price entre 50 y 250.
app.get('/products/price/:min/:max', (req, res) => {
    const results = items.filter(item =>
        item.price >= +req.params.min && item.price <= +req.params.max
    );
    res.send({ total: results.length, items: results, cositas:dameCositas() });
});

// Crear un filtro que cuando busque en postman por parámetro el id de un producto me devuelva ese producto
app.get('/products/:id', (req, res) => {
    const hasItems = items.filter(item => item.id === +req.params.id);

    if (hasItems.length > 0) {
        res.send({ item: hasItems[0], cositas:dameCositas() });
    } else {
        res.status(404).send({ msg: 'Product not found', cositas:dameCositas() });
    }
});

// Crear un filtro que cuando busque en postman por parámetro el name de un producto me devuelva ese producto
app.get('/products/name/:name', (req, res) => {

    const results = items.filter(item => item.name === req.params.name);

    res.send({ total: results.length, items: results, cositas:dameCositas() });
});

// Crear un filtro que cuando busque en postman por parámetro el name de un producto me devuelva ese producto
app.get('/products/search/:search', (req, res) => {

    const regex = new RegExp(`.*${req.params.search}.*`, 'i');

    const results = items.filter(item => regex.test(item.name));

    res.send({ total: results.length, items: results, cositas:dameCositas() });
});


////////////////////////////////////////////////////////////////////////////////
// Listen
app.listen(port, () => { console.log(`Server up in port ${port}!`); });
