export default class AddBookRequest{

    title:string;
    author:string;
    description:string;
    category:string;
    copies:number;
    copiesAvailable:number;
    image:any;

    constructor(title:string,author:string,description:string,category:string,
        copies:number,image:any){
            this.title = title;
            this.author = author;
            this.description = description;
            this.category = category;
            this.copies = copies;
            this.copiesAvailable = copies;
            this.image = image;
        }
}