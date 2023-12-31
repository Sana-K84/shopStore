"use strict"
//==========================================
import { ERROR_SERVER, NO_ITEMS_CART } from './constants.js';
import {
    showErrorMessage,
    setBasketLocalStorage,
    getBasketLocalStorage,
    checkingRelevanceValueBasket
} from './utils.js';

const cart = document.querySelector('.cart');
let productsData = [];

getProducts()
cart.addEventListener('click', delProductBasket)
async function getProducts() {
    try {
        if (!productsData.length) {
            const res = await fetch('../data/products.json');
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            productsData = await res.json();
        }

        loadProductBasket(productsData);

    } catch (err) {
        showErrorMessage(ERROR_SERVER);
        console.log(err)
    }
}

function loadProductBasket(data) {
    cart.textContent = '';

    if (!data || !data.length) {
        showErrorMessage(ERROR_SERVER);
        return
    }

    checkingRelevanceValueBasket(data);

    const basket = getBasketLocalStorage();

    if (!basket || !basket.length) {
        showErrorMessage(NO_ITEMS_CART);
        return
    }

    const findProducts = data.filter(el => basket.includes(String(el.id)));

    if (!findProducts.length) {
        showErrorMessage(NO_ITEMS_CART);
        return
    }

    renderProductsBasket(findProducts)
}


function delProductBasket(ev) {
    const targetButton = ev.target.closest('.cart__del-card');
    if (!targetButton) return

    const card = targetButton.closest('.cart__product');
    const id = card.dataset.productId;

    const basket = getBasketLocalStorage();

    const newBasket = basket.filter(el => el !== id)
    setBasketLocalStorage(newBasket);
    getProducts()
    totalPriceRender()
}


// Рендер товаров в корзине
function renderProductsBasket(arr) {
    arr.forEach(card => {
        const { id, img, title, price, discount } = card;
        const priceDiscount = price - ((price * discount) / 100);

        const cardItem =
            `
        <div class="cart__product" data-product-id="${id}">
            <div class="cart__img">
                <img src="./images/${img}" alt="${title}">
            </div>
            <div class="cart__title">${title}</div>
            <div class="cart__block-btns">
                <div class="cart__minus">-</div>
                <div class="cart__count">1</div>
                <div class="cart__plus">+</div>
            </div>
            <div class="cart__price">
                <span>${price}</span>₽
            </div>
            <div class="cart__price-discount">
                <span>${priceDiscount}</span>₽
            </div>
            <div class="cart__del-card">X</div>
        </div>
        `;

        cart.insertAdjacentHTML('beforeend', cardItem);
    });
    totalPriceRender()
}


cart.addEventListener('click', pieceCounter)

function pieceCounter(ev) {

    const cartBlockBtns = ev.target.closest('.cart__block-btns');
    if (!cartBlockBtns) return
    const targetBlockBtn = ev.target.classList.value;
    const count = cartBlockBtns.querySelector('.cart__count');

    const cartProduct = ev.target.closest('.cart__product');
    const cartPrice = cartProduct.querySelector('.cart__price span');
    const cartPriceDiscount = cartProduct.querySelector('.cart__price-discount span');

    if (targetBlockBtn === 'cart__plus') {
        cartPrice.textContent /= count.textContent;
        cartPriceDiscount.textContent /= count.textContent;
        count.textContent++;
        cartPrice.textContent *= count.textContent
        cartPriceDiscount.textContent *= count.textContent
    }
    if (targetBlockBtn === 'cart__minus') {
        if (count.textContent === '1') {
            count.textContent
        } else {
            cartPrice.textContent /= count.textContent
            cartPriceDiscount.textContent /= count.textContent;
            count.textContent--;
            cartPrice.textContent *= count.textContent
            cartPriceDiscount.textContent *= count.textContent
        }
    }
    totalPriceRender()
}
function totalPriceRender() {
    const price = document.querySelectorAll('.cart__price-discount span');
    const totalPrice = document.querySelector('.total-price span');

    totalPrice.textContent = [...price].reduce((acc, el) => acc += +el.innerText, 0)
}
