class ReviewModel{

    id:number;
    userEmail?:string;
    date:string;
    rating:number;
    bookId:number;
    reviewDescription?:string;

    constructor(id:number,email:string,date:string,rating:number,bookId:number,review:string){
        this.id = id;
        this.userEmail = email;
        this.date=date;
        this.rating = rating;
        this.bookId = bookId;
        this.reviewDescription = review;
    }
}

export default ReviewModel;