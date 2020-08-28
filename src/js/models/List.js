//we vasically created an api for creating and updating lists

import uniqid from 'uniqid';


export default class List{
    constructor(){
        this.items = [];
    }

    addItem(count,unit,ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        const index = this.items.findIndex(el=>el.id===id); //loops through all the elements in the items and as soon as the id is found the callback function returns it to el
        //[2,4,8] splice(1,2) ->returns [4,8],original array now is [2]
        //[2,4,8] slice(1,2) ->returns [4],original array now is [2,4,8]
        this.items.splice(index,1);

    }

    updateCount(id,newCount){
        this.items.find(el=>el.id===id).count = newCount; //loops through all the elements in the items and as soon as the id is found the callback function returns it to el
    }
}