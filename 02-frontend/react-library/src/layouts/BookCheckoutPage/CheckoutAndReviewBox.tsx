import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";
import BookModel from "../../models/BookModel";
import { LeaveAReview } from "../Utils/LeaveAReview";
import { BookCheckoutPage } from "./BookCheckoutPage";

export const CheckoutAndReviewBox: React.FC<{
  book: BookModel | undefined;
  mobile: boolean;
  currentLoansCount: number;
  isCheckedout: boolean;
  isAuthenticated: any;
  isAlreadyReviewed: boolean;
  checkoutBook: Function;
  postReview:Function;
  
}> = (props) => {
  function bookCheckout() {
    if (props.isAuthenticated) {
      if (props.currentLoansCount > 5)
        return (
          <p className="text-danger">
            <b>Too many books checked out!</b>
          </p>
        );
      else if (props.isCheckedout) return <b>Book Checked out already!!</b>;
      else
        return (
          <button
            onClick={() => props.checkoutBook()}
            className="btn btn-lg btn-success"
          >
            Checkout
          </button>
        );
    } else return <button className="btn btn-lg btn-success">Sign in</button>;
  }

  function bookReviewed() {
    if (props.isAuthenticated) {
      if (props.isAlreadyReviewed) return <p>Thank you for your review!</p>;
      else return <LeaveAReview postReview={props.postReview}/>;
    } else
      return (
        <div>
          <hr />
          <p>You need to be logged in to leave a review.</p>
        </div>
      );
  }
  return (
    <div
      className={
        props.mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"
      }
    >
      <div className="card-body container">
        <div className="mt-3">
          <p>
            <b>{props.currentLoansCount}/5 </b>
            books checked out
          </p>
          <hr />
          {props.book &&
          props.book.copiesAvailable &&
          props.book.copiesAvailable > 0 ? (
            <h4 className="text-success">Available</h4>
          ) : (
            <h4 className="text-danger">Wait List</h4>
          )}
          <div className="row">
            <p className="col-6 lead">
              <b>{props.book?.copies}</b>
              copies
            </p>
            <p className="col-6 lead">
              <b>{props.book?.copiesAvailable} </b>
              available
            </p>
          </div>
        </div>
        {bookCheckout()}
        <hr />
        <p className="mt-3">This no. can change until order is placed.</p>

        {bookReviewed()}
      </div>
    </div>
  );
};
