import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HistoryModel from "../../../models/HistoryModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoader } from "../../Utils/SpinnerLoader";

export const HistoryPage = () => {
  const { authState } = useOktaAuth();

  const [histories, setHistories] = useState<HistoryModel[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [httpError, setHttpError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchLoanHistory = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${
          process.env.REACT_APP_API
        }/histories/search/findBooksByUserEmail?userEmail=${
          authState.accessToken?.claims.sub
        }&page=${currentPage - 1}&size=5`;

        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(url, requestOptions);

        if (!response.ok) throw new Error("Something went wrong!!");

        const responseJson = await response.json();

        setHistories(responseJson._embedded.histories);
        setTotalPages(responseJson.page.totalPages);
        setIsLoading(false);
      }
    };

    fetchLoanHistory().catch((err) => {
      setIsLoading(false);
      setHttpError(err.message);
    });
  }, [currentPage, authState]);

  if (isLoading) return <SpinnerLoader />;

  if (httpError != null) {
    return <p className="m-3">{httpError}</p>;
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-2">
      {histories.length > 0 ? (
        <>
          <h5>Recent History</h5>
          {histories.map((history) => {
            return (
              <div key={history.id}>
                <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                  <div className="row g-0">
                    <div className="col-md-2">
                      <div className="d-none d-lg-block">
                        {history.img ? (
                          <img
                            src={history.img}
                            width="123"
                            height="196"
                            alt="Book"
                          />
                        ) : (
                          <img
                            src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                            width="123"
                            height="196"
                            alt="default"
                          />
                        )}
                      </div>
                      <div className="d-lg-none d-flex justify-content-center align-items-center">
                        {history.img ? (
                          <img
                            src={history.img}
                            width="123"
                            height="196"
                            alt="Book"
                          />
                        ) : (
                          <img
                            src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                            width="123"
                            height="196"
                            alt="default"
                          />
                        )}
                      </div>
                    </div>
                    <div className="col">
                      <div className="card-body">
                        <h5 className="card-title">{history.author}</h5>
                        <h4>{history.title}</h4>
                        <p className="card-text">{history.description}</p>
                        <hr />
                        <p className="card-text">
                          Checked out on: {history.checkoutDate}
                        </p>
                        <p className="card-text">
                          Returned on: {history.returnedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            );
          })}
        </>
      ) : (
        <>
          <h3 className="mt-3">Currently no history:</h3>
          <Link to={"search"} className="btn btn-primary">
            Search for new book
          </Link>
        </>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
