import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import { SpinnerLoader } from "../../Utils/SpinnerLoader";
import { LoansModal } from "./LoansModal";

export const ShelfLoans = () => {
  const { authState } = useOktaAuth();

  const [shelfCurrentLoans, setShelfCurrentLoans] = useState<
    ShelfCurrentLoans[]
  >([]);

  const [httpError, setHttpError] = useState(null);

  const [isLoansLoading, setIsLoansLoading] = useState(true);

  const [checkout, setCheckout] = useState(false);
  const [isLoanRenewed, setIsLoanRenewed] = useState(false);

  useEffect(() => {
    const fetchCurrentLoans = async () => {
      const url = `${process.env.REACT_APP_API}/books/secure/currentLoans`;

      const requestOptions = {
        method: "GET",
        headers: {
          authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
      };

      const currentLoans = await fetch(url, requestOptions);

      if (!currentLoans.ok) throw new Error("Something went wrong!");

      const currentLoansResponse = await currentLoans.json();

      setShelfCurrentLoans(currentLoansResponse);
      setIsLoansLoading(false);
    };

    fetchCurrentLoans().catch((err: any) => {
      setIsLoansLoading(false);
      setHttpError(err.message);
    });

    window.scrollTo(0, 0);
  }, [authState, checkout]);

  if (isLoansLoading) return <SpinnerLoader />;

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function returnBook(bookId: number) {
    const url = `${process.env.REACT_APP_API}/books/secure/return/?bookId=${bookId}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const responseData = await fetch(url, requestOptions);

    if (!responseData.ok) throw new Error("Something went wrong!!");

    setCheckout(!checkout);
  }

  async function renewLoan(bookId: number) {
    const url = `${process.env.REACT_APP_API}/books/secure/renew/loan/?bookId=${bookId}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const responseData = await fetch(url, requestOptions);

    if (!responseData.ok) throw new Error("Something went wrong!!");

    setCheckout(!checkout);
  }

  return (
    <div>
      {/* Desktop */}
      <div className="d-none d-lg-block mt-2">
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5>Current Loans:</h5>

            {shelfCurrentLoans.map((loans) => (
              <div key={loans.book.id}>
                <div className="row mt-3 mb-3">
                  <div className="col-4 col-md-4 container">
                    {loans.book?.img ? (
                      <img
                        src={loans.book?.img}
                        height="329"
                        width="226"
                        alt="book"
                      />
                    ) : (
                      <img
                        src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                        height="329"
                        width="226"
                      />
                    )}
                  </div>
                  <div className="col-3 col-md-3 container d-flex">
                    <div className="card-body">
                      <div className="mt-3">
                        <h4>Loan options</h4>
                        {loans.daysLeft > 0 && (
                          <p className="text-secondary">
                            Due in {loans.daysLeft} days.
                          </p>
                        )}

                        {loans.daysLeft === 0 && (
                          <p className="text-success">Due Today.</p>
                        )}

                        {loans.daysLeft < 0 && (
                          <p className="text-danger">
                            Past due by {loans.daysLeft * -1} days.
                          </p>
                        )}
                        <div className="list-group mt-3">
                          <button
                            className="list-group-item list-group-item-action"
                            aria-current="true"
                            data-bs-toggle="modal"
                            data-bs-target={`#modal${loans.book?.id}`}
                          >
                            Manage Loans
                          </button>
                          <Link
                            to={"search"}
                            className="list-group-item list-group-item-action"
                          >
                            Search more books?
                          </Link>
                        </div>
                      </div>
                      <hr />
                      <p className="mt-3">
                        Help others find their adventure by reviewing your book
                      </p>
                      <Link
                        to={`/checkout/${loans.book.id}`}
                        className="btn btn-primary"
                      >
                        Leave a Review
                      </Link>
                    </div>
                  </div>
                </div>
                <hr />
                <LoansModal
                  loans={loans}
                  mobile={false}
                  returnBook={returnBook}
                  renewLoan={renewLoan}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no loans</h3>
            <Link className="btn btn-primary" to={"search"}>
              Search for a new book
            </Link>
          </>
        )}
      </div>
      {/* Mobile */}
      <div className="container d-lg-none mt-2">
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5 className="mb-3 ">Current Loans:</h5>

            {shelfCurrentLoans.map((loans) => (
              <div key={loans.book.id}>
                <div className="d-flex justify-content-center align-items-center">
                  {loans.book?.img ? (
                    <img
                      src={loans.book?.img}
                      height="329"
                      width="226"
                      alt="book"
                    />
                  ) : (
                    <img
                      src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                      height="329"
                      width="226"
                    />
                  )}
                </div>
                <div className="card d-flex mt-5 mb-3">
                  <div className="card-body container ">
                    <div className="mt-3">
                      <h4>Loan options</h4>
                      {loans.daysLeft > 0 && (
                        <p className="text-secondary">
                          Due in {loans.daysLeft} days.
                        </p>
                      )}

                      {loans.daysLeft === 0 && (
                        <p className="text-success">Due Today.</p>
                      )}

                      {loans.daysLeft < 0 && (
                        <p className="text-danger">
                          Past due by {loans.daysLeft * -1} days.
                        </p>
                      )}
                      <div className="list-group mt-3">
                        <button
                          className="list-group-item list-group-item-action"
                          aria-current="true"
                          data-bs-toggle="modal"
                          data-bs-target={`#mobilemodal${loans.book?.id}`}
                        >
                          Manage Loans
                        </button>
                        <Link
                          to={"search"}
                          className="list-group-item list-group-item-action"
                        >
                          Search more books?
                        </Link>
                      </div>
                    </div>
                    <hr />
                    <p className="mt-3">
                      Help others find their adventure by reviewing your book
                    </p>
                    <Link
                      to={`/checkout/${loans.book.id}`}
                      className="btn btn-primary"
                    >
                      Leave a Review
                    </Link>
                  </div>
                </div>
                <hr />
                <LoansModal
                  loans={loans}
                  mobile={true}
                  returnBook={returnBook}
                  renewLoan={renewLoan}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no loans</h3>
            <Link className="btn btn-primary" to={"search"}>
              Search for a new book
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
