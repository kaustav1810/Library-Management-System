import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoader } from "../../Utils/SpinnerLoader";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";

export const ChangeQuantityOfBooks = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setisLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [booksPerPage] = useState(5);
  const [category, setCategory] = useState("All");

  const [deleteBook, setDeleteBook] = useState(false);

  const indexOfLastBook = booksPerPage * currentPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  let lastItem =
    indexOfLastBook <= totalElements ? indexOfLastBook : totalElements;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `${process.env.REACT_APP_API}/books?page=${
        currentPage - 1
      }&size=${booksPerPage}`;

      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Failed to get response!!");
      }

      const responseJson = await response.json();

      setTotalPages(responseJson.page.totalPages);
      setTotalElements(responseJson.page.totalElements);

      const responseData = responseJson._embedded.books;

      const loadedBooks: BookModel[] = [];

      for (let book of responseData) {
        loadedBooks.push(book);
      }
      setBooks(loadedBooks);
      setisLoading(false);
    };

    fetchBooks().catch((error: any) => {
      setisLoading(false);
      setHttpError(error.message);
    });
  }, [currentPage, deleteBook]);

  const handleDeleteBook = () => setDeleteBook(!deleteBook);

  if (isLoading) return <SpinnerLoader />;

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }
  return (
    <div className="container mt-5">
      {totalElements > 0 ? (
        <>
          <div className="mt-3">
            <h3>Number of results: ({totalElements})</h3>
          </div>
          <p>
            {indexOfFirstBook + 1} to {lastItem} of {totalElements} items
          </p>
          {books.map((book) => (
            <ChangeQuantityOfBook
              deleteBook={handleDeleteBook}
              book={book}
              key={book.id}
            />
          ))}
        </>
      ) : (
        <h5>Add a book before changing quantity</h5>
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
