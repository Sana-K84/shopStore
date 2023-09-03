"use strict"
//==========================================
import {
    showErrorMessage,
    setBasketLocalStorage,
    getBasketLocalStorage,
    checkingRelevanceValueBasket
} from './utils.js';

import {
    COUNT_SHOW_CARDS_CLICK,
    ERROR_SERVER,
    NO_PRODUCTS_IN_THIS_CATEGORY
} from './constants.js';

const cards = document.querySelector('.cards');
const btnShowCards = document.querySelector('.show-cards');
let shownCards = COUNT_SHOW_CARDS_CLICK;
let countClickBtnShowCards = 1;
let productsData = [];

getProducts()


btnShowCards.addEventListener('click', sliceArrCards)
async function getProducts() {
    try {
        if (!productsData.length) {
            const res = await fetch('../data/products.json');
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            productsData = await res.json();
        }

        if ((productsData.length > COUNT_SHOW_CARDS_CLICK) &&
            btnShowCards.classList.contains('none')) {
            btnShowCards.classList.remove('none')
        }

        renderStartPage(productsData)

    } catch (err) {
        showErrorMessage(ERROR_SERVER);
        console.log(err)
    }
}


function renderStartPage(data) {
    if (!data || !data.length) {
        showErrorMessage(NO_PRODUCTS_IN_THIS_CATEGORY);
        return
    }
    const arrCards = data.slice(0, COUNT_SHOW_CARDS_CLICK);
    createCards(arrCards)
}


// Рендер карточки
function createCards(data) {
    data.forEach(card => {
        const { id, img, title, price, discount } = card;
        const priceDiscount = price - ((price * discount) / 100);
        const cardItem =
            `
                <div class="card" data-product-id="${id}">
                    <div class="card__top">
                        <a href="/card.html?id=${id}" class="card__image">
                            <img
                                src="./images/${img}"
                                alt="${title}"
                            />
                        </a>
                        <div class="card__label">-${discount}%</div>
                    </div>
                    <div class="card__bottom">
                        <div class="card__prices">
                            <div class="card__price card__price--discount">${priceDiscount}</div>
                            <div class="card__price card__price--common">${price}</div>
                        </div>
                        <a href="/card.html?id=${id}" class="card__title">${title}</a>
                        <button class="card__add">В корзину</button>
                    </div>
                </div>
            `
        cards.insertAdjacentHTML('beforeend', cardItem);
    });
}

function sliceArrCards() {
    if (shownCards >= productsData.length) {
        return
    }
    countClickBtnShowCards++;
    const countShowCards = COUNT_SHOW_CARDS_CLICK * countClickBtnShowCards;
    const arrCards = productsData.slice(shownCards, countShowCards);
    createCards(arrCards);

}



