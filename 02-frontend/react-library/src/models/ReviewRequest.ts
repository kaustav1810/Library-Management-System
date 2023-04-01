class ReviewRequest{

    rating:number;
    bookId:number;
    reviewDescription?:string;

    constructor(rating:number,bookId:number,review:string){
        this.rating = rating;
        this.bookId = bookId;
        this.reviewDescription = review;
    }
}

export default ReviewRequest;