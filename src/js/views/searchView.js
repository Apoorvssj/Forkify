import { elements } from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    //inside curly brace not returning anything
    //clearing search input field after a search
    elements.searchInput.value='';
};
export const clearResults = ()=>{
    //clearing old recipe html to show new recipe of a new search
  elements.searchResList.innerHTML='';//to clear recipes
  elements.searchResPages.innerHTML='';//to clear pagination buttons
};
export const highlightSelected = (id)=>{
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el=>{
        el.classList.remove('results__link--active');
    });
//element is not there on load so cant put it in base.js
document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');//(`a[href="#${id}"]`)selecting all of the anchors/links haaving href with a particular id,in this case selecting all links in results__link
};

//To titles to occupy just one line without cutting words in half
//limit is the no. of characters acceptable(maximum lenght of title),giving it as a default parameter
/*
// 'Pasta with tomato and spinach'
(accumulator)acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']
*/
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        //split(' ') returns an array with each element of title string be splitted after a space
        //so we can use reduce method on it
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);//pushing is not mutating so can be done on const(same with objects as well)
            }
            return acc + cur.length;
        }, 0);

        // return the result
        return `${newTitle.join(' ')} ...`;//join method is opposite of split it will join the array into a string giving space after each element
    }
    return title;
}

//rendering one li element(recipe) from index.html(results list)
const renderRecipe = recipe => {
    //recieves recipe from renderResults()
    const markup = `
 <li>
 <a class="results__link " href="#${recipe.recipe_id}">
     <figure class="results__fig">
         <img src="${recipe.image_url}" alt="${recipe.title}">
     </figure>
     <div class="results__data">
         <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
         <p class="results__author">${recipe.publisher}</p>
     </div>
 </a>
</li>
 `;
 elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

//we want to automatically just return the markup so no braces,taken from  <div class="results__pages">
//type:'prev' or'next'
const createButton=(page,type)=>`
<button class="btn-inline results__btn--${type}" data-goto=${type==='prev'?page-1:page+1}>
<span>Page ${type==='prev'?page-1:page+1}</span>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${type==='prev'?'left':'right'}"></use>
</svg>
</button>
`;

const renderButtons =(page,numResults,resPerPage)=>{
    const pages = Math.ceil(numResults/resPerPage);//total no. of pages,will round it to the next integer
    let button;
    if(page===1&& pages>1){
        //Only button to go to the next page
        button = createButton(page,'next');
    }
    else if(page<pages){
        //Both buttons
        button =`
        ${createButton(page,'prev')}
        ${createButton(page,'next')}
        ` ;

    }
    else if(page===pages&& pages>1){
        //Only button to go to the prev page
        button = createButton(page,'prev');

    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

//this is to loop through all recipe and then render them by using renderRecipe
export const renderResults = (recipes,page=1,resPerPage=10)=>{
    //render the results of the current page
    const start = (page-1)*resPerPage;
    const end = page*resPerPage;
    //recieves value from index.js
    recipes.slice(start,end).forEach(renderRecipe);
    
    //render pagination buttons
    renderButtons(page,recipes.length,resPerPage);
};
