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
const sectProduct = document.querySelector('#product');
const productsList = document.querySelector('#products-list');
const productForm = document.querySelector('#product-form');
const productH2 = document.querySelector('#product-h2');
const cositaBox = document.querySelector('#cosita');
const spinnerBox = document.getElementById("spinner");


////////////////////////////////////////////////////////////////////////////////
// Globals


////////////////////////////////////////////////////////////////////////////////
// Classes


////////////////////////////////////////////////////////////////////////////////
// Utils
function hideAllSections() {
    spinnerBox.classList.remove("d-none");
    document.querySelectorAll('section').forEach(sect => sect.classList.add('d-none'));
}

function showSection(sect) {
    setTimeout(() => {
        sect.classList.remove("d-none");
        spinnerBox.classList.add("d-none");
    }, 300);
}

////////////////////////////////////////////////////////////////////////////////
// Calls to API
function getList(callback) {
    axios(APIURL + 'products')
        .then(res => callback(res.data))
        .catch(err => console.error(err));
}

function getSearch(search, callback) {
    axios(APIURL + `products/search/${search}`)
        .then(res => callback(res.data))
        .catch(err => console.error(err));
}

function deleteItem(id, callback) {
    axios.delete(APIURL + `products/${id}`)
        .then(res => callback(res.data))
        .catch(err => console.error(err));
}

function postNewProduct(newItem, callback) {
    axios.post(APIURL + 'products', newItem)
        .then(res => callback(res.data))
        .catch(err => console.error(err));
}

function putEditProduct(item, callback) {
    axios.put(APIURL + `products/${item.id}`, item)
        .then(res => callback(res.data))
        .catch(err => console.error(err));
}

////////////////////////////////////////////////////////////////////////////////
// System Functions
function showProductsSection() {
    hideAllSections();
    getList(putProducts)
}

function putProducts(data) {

    putCositas(data.cositas);

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

function showProductForm(ev) {
    ev.preventDefault();
    hideAllSections();
    productForm.prodId.value = "";
    productForm.prodName.style.backgroundColor = 'white';
    productForm.prodName.value = '';
    productForm.prodPrice.style.backgroundColor = 'white';
    productForm.prodPrice.value = '';
    productH2.innerHTML = 'New Product';
    showSection(sectProduct);
}

function goNewOrEditProduct(ev) {
    ev.preventDefault();
    productForm.prodName.style.backgroundColor = 'white';
    productForm.prodPrice.style.backgroundColor = 'white';

    const aProduct = {
        id: productForm.prodId.value,
        name: productForm.prodName.value,
        price: productForm.prodPrice.value
    }

    let valid = true;

    if (!aProduct.name) {
        productForm.prodName.style.backgroundColor = 'lightpink';
        valid = false;
    }

    if (!aProduct.price || isNaN(aProduct.price)) {
        productForm.prodPrice.style.backgroundColor = 'lightpink';
        valid = false;
    }
    if (!valid) {
        return;
    }

    hideAllSections();

    if (aProduct.id === "") {
        postNewProduct(aProduct, putProducts);
    } else {
        putEditProduct(aProduct, putProducts);
    }
}

function editMe(id, name, price) {
    hideAllSections();
    productForm.prodId.value = id;
    productForm.prodName.style.backgroundColor = 'white';
    productForm.prodName.value = name;
    productForm.prodPrice.style.backgroundColor = 'white';
    productForm.prodPrice.value = price;
    productH2.innerHTML = 'Edit Product';
    showSection(sectProduct);
}

function putCositas(cosita) {
    cositaBox.innerHTML = `<cite>“${cosita}”</cite> M.R.`;
}


////////////////////////////////////////////////////////////////////////////////
// Listeners
btnProducts.addEventListener("click", showProductsSection);
btnNewProduct.addEventListener("click", showProductForm);
searchForm.addEventListener("submit", goSearch);
productForm.addEventListener("submit", goNewOrEditProduct);

////////////////////////////////////////////////////////////////////////////////
// Init
showProductsSection();
