"use strict"
//==========================================
import { ERROR_SERVER, PRODUCT_INFORMATION_NOT_FOUND } from './constants.js';
import {
    showErrorMessage,
    checkingRelevanceValueBasket
} from './utils.js';

const wrapper = document.querySelector('.wrapper');
let productsData = [];

getProducts()

async function getProducts() {
    try {
        if (!productsData.length) {
            const res = await fetch('../data/products.json');
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            productsData = await res.json();
        }

        loadProductDetails(productsData);

    } catch (err) {
        showErrorMessage(ERROR_SERVER);
        console.log(err)
    }
}





// Рендер информации о товаре
function renderInfoProduct(product) {
    const { img, title, price, discount, descr } = product;
    const priceDiscount = price - ((price * discount) / 100);
    const productItem =
        `
        <div class="product">
            <h2 class="product__title">${title}</h2>
            <div class="product__img">
                <img src="./images/${img}" alt="${title}">
            </div>
            <p class="product__descr">${descr}</p>
            <div class="product__inner-price">
                <div class="product__price">
                    <b>Цена:</b>
                    ${price}₽
                </div>
                <div class="product__discount">
                    <b>Цена со скидкой:</b>
                    ${priceDiscount}₽
                </div>
            </div>
        </div>
        `
    wrapper.insertAdjacentHTML('beforeend', productItem);
}