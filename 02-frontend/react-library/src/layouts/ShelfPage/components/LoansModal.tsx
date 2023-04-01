import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";

export const LoansModal: React.FC<{
  loans: ShelfCurrentLoans;
  mobile: boolean;
  returnBook:Function;
  renewLoan:Function;
}> = (props) => {
  return (
    <div
      className="modal fade"
      id={
        props.mobile
          ? `mobilemodal${props.loans.book?.id}`
          : `modal${props.loans.book?.id}`
      }
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="staticBackdroplabel"
      aria-hidden="true"
      key={props.loans.book?.id}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdroplabel">
              Loan options
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="mt-3">
                <div className="row">
                  <div className="col-2">
                    {props.loans.book?.img ? (
                      <img
                        src={props.loans.book?.img}
                        width="56"
                        height="87"
                        alt="book"
                      />
                    ) : (
                      <img
                        src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                        width="56"
                        height="87"
                        alt="book"
                      />
                    )}
                  </div>
                  <div className="col-10">
                    <h6>{props.loans.book?.author}</h6>
                    <h4>{props.loans.book?.title}</h4>
                  </div>
                </div>
                <hr />
                {props.loans.daysLeft > 0 && (
                  <p className="text-secondary">
                    Due in {props.loans.daysLeft} days.
                  </p>
                )}

                {props.loans.daysLeft === 0 && (
                  <p className="text-success">Due Today.</p>
                )}

                {props.loans.daysLeft < 0 && (
                  <p className="text-danger">
                    Past due by {props.loans.daysLeft * -1} days.
                  </p>
                )}
                <div className="list-group mt-3">
                  <button
                    type="button"
                    onClick={()=>props.returnBook(props.loans.book?.id)}
                    aria-current="true"
                    data-bs-dismiss="modal"
                    className="list-group-item list-group-item-action"
                  >Return Book</button>
                  <button
                    type="button"
                    onClick={(e)=>
                      props.loans.daysLeft<0?
                      e.preventDefault()
                      :
                      props.renewLoan(props.loans.book?.id)}
                    data-bs-dismiss="modal"
                    className={
                      props.loans.daysLeft < 0
                        ? "list-group-item list-group-item-action inactiveLink"
                        : "list-group-item list-group-item-action"
                    }
                  >
                    {props.loans.daysLeft<0?
                    "Late dues cannot be renewed":"Renew book for 7 days"    
                }
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal" type="button">
                Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
