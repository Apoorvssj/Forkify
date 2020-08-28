export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id,title,author,img){
        const like = {id,title,author,img};//id:id,title:tittle and so on
        this.likes.push(like);

        //Persist data in localStorage ass soon as the array changes
        this.persistData();
        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el=>el.id===id); //loops through all the elements in the items and as soon as the id is found the callback function returns it to el
        //[2,4,8] splice(1,2) ->returns [4,8],original array now is [2]
        //[2,4,8] slice(1,2) ->returns [4],original array now is [2,4,8]
        this.likes.splice(index,1);

        //Persist data in localStorage ass soon as the array changes
        this.persistData();
    }

    isLiked(id){
        //if index is -1 that means it is not there
        //if -1 will retun false else true
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        //converting entire this.likes array(which is the value) into string
        localStorage.setItem('likes',JSON.stringify(this.likes));//all of the likes will stored in the single likes key
    }

    readStorage(){
        const storage =JSON.parse (localStorage.getItem('likes'));//convert everything back to the data structures they were before in our case array
        //Restoring likes from the localStorage
        if(storage) this.likes = storage;//if storage is not null
    }
}