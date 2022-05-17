'use strict';
////////////////////////////////////////////////////////////////////////////////
// Express API - Exercise
// for The Bridge
// by  xavimat
// 2022-05-17
//
////////////////////////////////////////////////////////////////////////////////
// Constants
const APIURL = 'http://localhost:3000/';


////////////////////////////////////////////////////////////////////////////////
// DOM
const btnProducts = document.querySelector('#navbtn-products');
const btnNewProduct = document.querySelector('#navbtn-new-product');
const searchForm = document.querySelector('#search-form');
const sectProducts = document.querySelector('#products');
const sectNewProduct = document.querySelector('#new-product');
const productsList = document.querySelector('#products-list');
const newProductForm = document.querySelector('#new-product-form');
const productH2 = document.querySelector('#product-h2');


////////////////////////////////////////////////////////////////////////////////
// Globals


////////////////////////////////////////////////////////////////////////////////
// Classes


////////////////////////////////////////////////////////////////////////////////
// Utils
function hideAllSections() {
    document.querySelectorAll('section').forEach(sect=>sect.classList.add('d-none'));
}

function showSection(sect) {
    sect.classList.remove('d-none');
}

////////////////////////////////////////////////////////////////////////////////
// Calls to API
function getList(callback) {
    axios(APIURL + 'products')
        .then(res=>callback(res.data))
        .catch(err=>console.error(err));
}

function getSearch(search, callback) {
    axios(APIURL + `products/search/${search}`)
        .then(res=>callback(res.data))
        .catch(err=>console.error(err));
}

function deleteItem(id, callback) {
    axios.delete(APIURL + `products/${id}`)
        .then(res=>callback(res.data))
        .catch(err=>console.error(err));
}

function postNewProduct(newItem, callback) {
    axios.post(APIURL + 'products', newItem)
        .then(res=>callback(res.data))
        .catch(err=>console.error(err));
}

function putEditProduct(item, callback) {
    axios.put(APIURL + `products/${item.id}`, item)
        .then(res=>callback(res.data))
        .catch(err=>console.error(err));
}

////////////////////////////////////////////////////////////////////////////////
// System Functions
function showProductsSection() {
    hideAllSections();
    getList(putProducts)
}

function putProducts(data) {

    productsList.innerHTML = '';

    let inn = '';

    data.items.forEach(item => {
        inn += `<li class="list-group-item list-group-item-action w-100 d-flex justify-content-between">`;
        inn += `<span><strong>${item.name}</strong> (${item.price} €)</span>`;
        inn += `<span><i class="bi bi-pencil-square me-4" `;
        inn += `onclick="editMe(${item.id},'${item.name}','${item.price}')"></i> `;
        inn += `<i class="bi bi-trash" onclick="deleteMe(${item.id})"></i></li>`;
    });

    if (inn) {
        inn = `<ul class="list-group">${inn}</ul>`;
    }
    else {
        inn = 'No products found.';
    }

    productsList.innerHTML = inn;

    showSection(sectProducts);
}

function goSearch(ev) {

    ev.preventDefault();
    searchForm.search.style.backgroundColor = 'white';

    const searchKey = searchForm.search.value;

    if (searchKey) {
        hideAllSections();
        getSearch(searchKey, putProducts);

    } else {
        searchForm.search.style.backgroundColor = 'lightpink';
    }
}

function deleteMe(id) {
    hideAllSections();
    deleteItem(id, putProducts);
}

function showNewProductForm(ev) {
    ev.preventDefault();
    hideAllSections();
    newProductForm.newId.value = "0";
    newProductForm.newName.style.backgroundColor = 'white';
    newProductForm.newName.value = '';
    newProductForm.newPrice.style.backgroundColor = 'white';
    newProductForm.newPrice.value = '';
    productH2.innerHTML = 'New Product';
    showSection(sectNewProduct);
}

function goNewOrEditProduct(ev) {
    ev.preventDefault();
    newProductForm.newName.style.backgroundColor = 'white';
    newProductForm.newPrice.style.backgroundColor = 'white';

    const aProduct = {
        id: newProductForm.newId.value,
        name: newProductForm.newName.value,
        price: newProductForm.newPrice.value
    }

    let valid = true;

    if (!aProduct.name) {
        newProductForm.newName.style.backgroundColor = 'lightpink';
        valid = false;
    }

    if (!aProduct.price || isNaN(aProduct.price)) {
        newProductForm.newPrice.style.backgroundColor = 'lightpink';
        valid = false;
    }
    if (!valid) {
        return;
    }

    hideAllSections();

    if (aProduct.id) {
        putEditProduct(aProduct, putProducts);
    } else {
        postNewProduct(aProduct, putProducts);
    }
}

function editMe(id, name, price) {
    hideAllSections();
    newProductForm.newId.value = id;
    newProductForm.newName.style.backgroundColor = 'white';
    newProductForm.newName.value = name;
    newProductForm.newPrice.style.backgroundColor = 'white';
    newProductForm.newPrice.value = price;
    productH2.innerHTML = 'Edit Product';
    showSection(sectNewProduct);
}


////////////////////////////////////////////////////////////////////////////////
// Listeners
btnProducts.addEventListener("click", showProductsSection);
btnNewProduct.addEventListener("click", showNewProductForm);
searchForm.addEventListener("submit", goSearch);
newProductForm.addEventListener("submit", goNewOrEditProduct);

////////////////////////////////////////////////////////////////////////////////
// Init
showProductsSection();
