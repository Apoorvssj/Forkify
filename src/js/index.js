// Global app controller
// import num from './test';//no need to put .js
// console.log(`I imported ${num} from another module`);

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/**Global state of the app
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * -Liked recipes
 */

const state = {};
//window.state=state;
/**
 * Search controller
 */

//can do normal function expression like this also
// const controlSearch = ()=>{

// }
//using async and await because we need to wait to get reults from api on using getResults(); method
const controlSearch = async ()=>{
    //1)Get query from view
    const query = searchView.getInput();
    if(query){
        //2) New search object and add it to the state
        state.search = new Search(query);
        //3)Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try{
        //4)Search for recipes
        await state.search.getResults();
        //5)Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        }catch(error){
            alert('Something wrong with the search...');
            
        }
       
    }

}
elements.searchForm.addEventListener('submit',e =>{
    e.preventDefault();//to stop reloading on clicking search button
    controlSearch();
});

//now we cant attach eventlistener to things which are not their yet,so we will use event deligation and attach listeners to alaments which are already their at the time of load and then from that will find out where the click happen
//results__pages is slready there for pagination buttons
elements.searchResPages.addEventListener('click',e=>{
   // console.log(e.target);//to see exactly where the click happened
   //now we click text,icon,button itself ,so to determine the srea of click we use closest method,search closest mdn on google for explanation
   const btn = e.target.closest('.btn-inline');//looking for closest integer only button with this class in index.html
  // console.log(btn);
  if(btn){
      const goTOPage = parseInt(btn.dataset.goto,10);//retrieving data from data attribute we added in html of button in searchView.js,goto is the custom name ,parse int base 10 (natural no.),default is this ,so no need to add it
      searchView.clearResults();
      searchView.renderResults(state.search.result,goTOPage);
     // console.log(goTOPage);
  }

});


//DONE in controlSearch function
// const search = new Search('pizza');
// console.log(search);
// search.getResults();

/**
 * Recipe controller
 */
const controlRecipe = async ()=>{
    //get ID from url
    const id = window.location.hash.replace('#','');
    //console.log(id);
    if(id){
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //highlight selected search item
        if(state.search)
        searchView.highlightSelected(id);
        //create new recipe object
        state.recipe = new Recipe(id);

        try{
         //get recipe data
        //rest of the code will be executed after promise is returned(we get recipe data),until then execution stops
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        //calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
        //render recipe
        //console.log(state.recipe);
        clearLoader();
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id)
            );

        }catch(err){
            alert('Error processing recipe!');
        }

    }
};
//window.addEventListener('hashchange',controlRecipe);
//window.addEventListener('load',controlRecipe);//when page gets loaded/reloaded
//add same event listener to different events
['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));


/**
 * List controller
 */

const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);//e.target is the current element that is clicked,//now we can read the value property of the input field
        state.list.updateCount(id, val);
    }
});

/**
 * Like controller
 */

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
      //  console.log(state.likes);
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes on page load and reload
window.addEventListener('load',()=>{
    state.likes = new Likes();

    //Restore likes
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render the existing likes in the like menu
    state.likes.likes.forEach(like=>likesView.renderLike(like));
});

//Handling recipe button clicks
elements.recipe.addEventListener('click',e=>{
    //using event delegation using matches,returns true or false
    //target matches .btn-decrease or any child of .btn-decrease(by using any(all of its child) child - *)
    if(e.target.matches('.btn-decrease,.btn-decrease *')){
        //decrease button is clicked
        if(state.recipe.servings>1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if(e.target.matches('.btn-increase,.btn-increase *')){
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if(e.target.matches('.recipe__btn--add,.recipe__btn--add *')){
        //add ingredients to shopping list
        controlList();
    } else if(e.target.matches('.recipe__love,.recipe__love *')){
        //like controller
        controlLike();
    }
   // console.log(state.recipe);

});

//window.l = new List();




