import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoader } from "../Utils/SpinnerLoader";
import { SearchBook } from "./components/SearchBook";
import React, { Component } from "react";
import { Pagination } from "../Utils/Pagination";

export const SearchBooksPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setisLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [booksPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [searchUrl, setSearchUrl] = useState("");
  const [category, setCategory] = useState("All");

  const indexOfLastBook = booksPerPage * currentPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  let lastItem =
    indexOfLastBook <= totalElements ? indexOfLastBook : totalElements;

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `${process.env.REACT_APP_API}/books`;

      let url: string;

      if (searchUrl !== "") {
        url = baseUrl + searchUrl;
      } else url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;

      const response = await fetch(url);

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

    window.scrollTo(0, 0);
  }, [currentPage, searchUrl]);

  if (isLoading) return <SpinnerLoader />;

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const handleSearch = (): void => {
    if (search === "") setSearchUrl("");
    else {
      let searchURL = `/search/findByTitleContaining?title=${search}&page=0&size=${booksPerPage}`;
      setSearchUrl(searchURL);
    }
  };

  const handleCategorySearch = (value: string): void => {
    setCategory(value);

    if (value == "All") {
      setSearch("");
      setSearchUrl("");
    } else {
      setSearch(value);
      setSearchUrl(
        `/search/findByCategory?category=${value}&page=0&size=${booksPerPage}`
      );
    }
  };
  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                <input
                  type="search"
                  className="form-control me-2"
                  placeholder="search"
                  aria-label="search"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-outline-success"
                  onClick={() => handleSearch()}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="col-4">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {category}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li onClick={() => handleCategorySearch("All")}>
                    <a href="#" className="dropdown-item">
                      All
                    </a>
                  </li>
                  <li onClick={() => handleCategorySearch("fe")}>
                    <a href="#" className="dropdown-item">
                      Frontend
                    </a>
                  </li>
                  <li onClick={() => handleCategorySearch("be")}>
                    <a href="#" className="dropdown-item">
                      Backend
                    </a>
                  </li>
                  <li onClick={() => handleCategorySearch("data")}>
                    <a href="#" className="dropdown-item">
                      Data
                    </a>
                  </li>
                  <li onClick={() => handleCategorySearch("devops")}>
                    <a href="#" className="dropdown-item">
                      Devops
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {totalElements > 0 ? (
            <>
              <div className="mt-3">
                <h5>Number of results: ({totalElements})</h5>
              </div>
              <p>
                {indexOfFirstBook + 1} to {lastItem} of {totalElements} items:
              </p>
              {books.map((book) => (
                <SearchBook book={book} key={book.id} />
              ))}
            </>
          ) : (
            <div className="m-5">
              <h3>Can't find what you are looking for?</h3>
              <a
                href="#"
                type="button"
                className="btn btn-md me-md-2 text-white px-2 bg-dark"
              >
                Library Services
              </a>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <Pagination
            paginate={(pageNum: number) => setCurrentPage(pageNum)}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
};
