//model class for search
import axios from 'axios';

//exporting a class
export default class Search{
constructor(query){
    this.query = query;
}
//as we are in a a class so we dont need function keyword with async(async function getResults())
//as now getResults is the method of the class do we dont need call statement =  getResults('pizza');after the end of async function
//so need to pass  query like getResults(query); we will read it from the object of class itself 
async  getResults(){
    //now the in api documentation it was listed we need to pass in api key and query adn etc.
    //api makers didnot applied cors in their api ,so we need to use proxy
    //using axios in place of fetch ,and in it you can see how to pass api key,and paameters like query and etc. in the api url
        //const proxy = 'https://cors-anywhere.herokuapp.com/';
       // const key = '';
        try{
            //foof2fork has been depriciated
            //const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`);//search is the method listed in api documentation,after that add ? to add your parameters seperated by &

            //using custom api forkify no api key and proxy required
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            //console.log(res);
            //const recipes = res.data.recipes;
            //console.log(recipes);
            //we want recipes to be saved in the class object as well so,
            this.result = res.data.recipes; //result property will be automatically added to the class
            //console.log(this.result);
        }catch(error){
            alert(error);
        }
    }
}