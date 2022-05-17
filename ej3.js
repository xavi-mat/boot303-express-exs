////////////////////////////////////////////////////////////////////////////////
// Imports
const express = require("express");
const app = express();
const cors = require("cors");

////////////////////////////////////////////////////////////////////////////////
// Constants
const port = 3000;

////////////////////////////////////////////////////////////////////////////////
// Fake BD
let items = [
    { id: 1, name: 'Taza de Harry Potter', price: 300 },
    { id: 2, name: 'FIFA 22 PS5', price: 1000 },
    { id: 3, name: 'Figura Goku Super Saiyan', price: 100 },
    { id: 4, name: 'Zelda Breath of the Wild', price: 200 },
    { id: 5, name: 'Skin Valorant', price: 120 },
    { id: 6, name: 'Taza de Star Wars', price: 220 }
]


////////////////////////////////////////////////////////////////////////////////
// Middlewares
app.use(express.json());
app.use(cors());


////////////////////////////////////////////////////////////////////////////////
// Endpoints
app.get('/', (req, res) => {
    res.send({ msg: 'welcome' });
});

app.get('/products', (req, res) => {
    res.send({ description: 'Productos', items });
});

// Crear endpoint para poder crear un producto nuevo
app.post('/products', (req, res) => {
    if (!req.body.name || !req.body.price) {
        res.status(422).send({ msg: 'Fill in all data' });
    } else {
        const newItem = {
            id: items.length + 1,
            name: req.body.name,
            price: req.body.price
        }
        items.push(newItem);
        res.status(201).send({msg: 'Item created', newItem, items})
    }
});

// Crear endpoint para poder actualizar un producto
app.put('/products/:id', (req, res) => {

    const hasItems = items.filter(item=>item.id===+req.params.id);

    if (hasItems.length > 0) {
        const item = hasItems[0];
        item.name = req.body.name ? req.body.name : item.name;
        item.price = req.body.price ? req.body.price : item.price;
        res.status(200).send({msg: 'Item updated', item});
    } else {
        res.status(404).send({ msg: 'Product not found' });
    }
});

// Crear endpoint para poder eliminar un producto
app.delete('/products/:id', (req, res) => {
    const hasItems = items.filter(item=>item.id===+req.params.id);

    if (hasItems.length > 0) {
        items = items.filter(item=>item.id!==+req.params.id);
        res.status(200).send({msg: 'Item deleted', items});
    } else {
        res.status(404).send({ msg: 'Product not found' });
    }
});

// Crear filtro por price de producto
// Crear filtro que muestre los productos con un price entre 50 y 250.
app.get('/products/price/:min/:max', (req, res)=>{
    const results = items.filter(item =>
        item.price >= +req.params.min && item.price <= +req.params.max
    );
    res.send({total: results.length, results});
});

// Crear un filtro que cuando busque en postman por parámetro el id de un producto me devuelva ese producto
app.get('/products/:id', (req, res) => {
    const hasItems = items.filter(item=>item.id===+req.params.id);

    if (hasItems.length > 0) {
        res.send({item:hasItems[0]});
    } else {
        res.status(404).send({ msg: 'Product not found' });
    }
});

// Crear un filtro que cuando busque en postman por parámetro el name de un producto me devuelva ese producto
app.get('/products/name/:name', (req, res) => {

    const results = items.filter(item=>item.name===req.params.name);

    if (results.length > 0) {
        res.send({ total: results.length, results });
    } else {
        res.status(404).send({ msg: 'No products found' });
    }
});

// Crear un filtro que cuando busque en postman por parámetro el name de un producto me devuelva ese producto
app.get('/products/search/:search', (req, res) => {

    const  regex = new RegExp(`.*${req.params.search}.*`);

    const results = items.filter(item=>regex.test(item.name));

    if (results.length > 0) {
        res.status(200).send({ total: results.length, results });
    } else {
        res.status(404).send({ msg: 'No products found' });
    }
});


// app.get('/users', (req, res) => {
//     res.send({ msg: 'users list' });
// });

// app.post('/users', (req, res) => {
//     res.send({ msg: 'Create a user' });
// });

// app.put('/users', (req, res) => {
//     res.send({ msg: 'Update a user' });
// });

// app.delete('/users', (req, res) => {
//     res.send({ msg: 'Delete a user' });
// });












////////////////////////////////////////////////////////////////////////////////
// Listen
app.listen(port, () => { console.log(`Server up in port ${port}!`); });
