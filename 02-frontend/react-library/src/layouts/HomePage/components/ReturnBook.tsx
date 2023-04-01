import { Link } from "react-router-dom";
import BookModel from "../../../models/BookModel";

export const ReturnBook:React.FC<{book:BookModel}> = (props) => {
  return (
    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div className="text-center">
        {props.book.img?
        
        <img
        src={props.book.img}
        height="250"
        width="233"
        alt="book"
        />
        :
        <img
        src={require("../../../Images/BooksImages/book-luv2code-1000.png")}
        height="200"
        width="233"
        alt="book"
        />
      }
        <h6 className="mt-2">{props.book.title}</h6>
        <p>{props.book.author}</p>
        <Link type="button" to={`/checkout/${props.book.id}`} className="btn main-color text-white">
          Reserve
        </Link>
      </div>
    </div>
  );
};
