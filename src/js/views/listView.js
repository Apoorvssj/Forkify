import {elements} from './base';

export const renderItem = item =>{
    //from  <ul class="shopping__list">
    //adding data attribute like in the searchView>createbutton
    //adding  class="shopping__count-value" so we can later select this input,so that we can read value here to update it in our model,newCount is gonna come from this input field
    const markup = `
    <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend',markup);
};

export const deleteItem = id =>{
    const item = document.querySelector(`[data-itemid="${id}"]`);//css attribute selector by simply using []
   if(item) item.parentElement.removeChild(item);
};