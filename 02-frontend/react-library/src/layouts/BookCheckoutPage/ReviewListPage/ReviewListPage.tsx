import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import ReviewRequest from "../../../models/ReviewRequest";
import { Pagination } from "../../Utils/Pagination";
import { Review } from "../../Utils/Review";
import { SpinnerLoader } from "../../Utils/SpinnerLoader";

export const ReviewListPage = () => {
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setisLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [reviewsPerPage] = useState(3);

  const indexOfLastReview = reviewsPerPage * currentPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  let lastItem =
    indexOfLastReview <= totalElements ? indexOfLastReview : totalElements;

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewUrl: string = `${
        process.env.REACT_APP_API
      }/reviews/search/findByBookId?bookId=${bookId}&page=${
        currentPage - 1
      }&size=${reviewsPerPage}`;

      const reviewResponse: any = await fetch(reviewUrl);

      if (!reviewResponse.ok) {
        throw new Error("something went wrong!");
      }

      const responseJson = await reviewResponse.json();

      setTotalPages(responseJson.page.totalPages);
      setTotalElements(responseJson.page.totalElements);

      const reviews = responseJson._embedded.reviews;

      const loadedReviews: ReviewModel[] = [];

      for (let review of reviews) {
        const { id, date, userEmail, rating, reviewDescription, bookId } =
          review;
        loadedReviews.push({
          id,
          date,
          userEmail,
          rating,
          reviewDescription,
          bookId,
        });
      }

      setReviews(loadedReviews);
      setisLoading(false);
    };

    fetchReviews().catch((error: any) => {
      setisLoading(false);
      setHttpError(error.message);
    });
  }, [currentPage]);

  if (isLoading) return <SpinnerLoader />;

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div className="container m-5">
      <div className="mt-3">
        <h5>Comments: ({totalElements})</h5>
      </div>
      <p>
        {indexOfFirstReview + 1} to {lastItem} of {totalElements} items:
      </p>
      {reviews.map((review) => (
        <Review review={review} />
      ))}

      {totalPages > 1 && (
        <Pagination
          paginate={(pageNum: number) => setCurrentPage(pageNum)}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};
