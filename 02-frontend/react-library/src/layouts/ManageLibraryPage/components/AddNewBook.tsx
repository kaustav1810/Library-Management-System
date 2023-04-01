import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import AddBookRequest from "../../../models/AddBookRequest";

export const AddNewBook = () => {
  const { authState } = useOktaAuth();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  const [selectedImage, setSelectedImage] = useState<any>(null);

  const [category, setCategory] = useState("Category");

  const [copies, setCopies] = useState(0);

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayWarning, setDisplayWarning] = useState(false);

  function categoryField(value: string) {
    setCategory(value);
  }

  async function base64ConversionForImages(e: any) {
    if (e.target.files[0]) {
      console.log("image received!!");

      base64(e.target.files[0]);
    }
  }

  async function handleSubmit() {
    const url = `${process.env.REACT_APP_API}/admin/secure/add/book`;

    const book: AddBookRequest = new AddBookRequest(
      title,
      author,
      description,
      category,
      copies,
      selectedImage
    );

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      setDisplaySuccess(false);
      setDisplayWarning(true);
      throw new Error("Something went wrong!");
    }

    setAuthor("");
    setTitle("");
    setDescription("");
    setCategory("Category");
    setCopies(0);

    setDisplaySuccess(true);
    setDisplayWarning(false);
  }

  function base64(file: any) {
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      console.log(reader.result);

      setSelectedImage(reader.result);
    };

    reader.onerror = (error) => {
      console.log("Error", error);
    };
  }

  return (
    <div className="container mt-5 mb-5">
      {displaySuccess && (
        <div className="alert alert-success">Book added successfully</div>
      )}
      {displayWarning && (
        <div className="alert alert-danger">All Fields must be filled out</div>
      )}

      <div className="card">
        <div className="card-header">Add a new book</div>
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="" className="form-label">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="" className="form-label">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={author}
                required
                onChange={(e) => setAuthor(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="" className="form-label">
                Category
              </label>

              <button
                className="form-control btn btn-secondary dropdown-toggle"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {category}
              </button>

              <ul
                id="addNewBookId"
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a
                    onClick={() => categoryField("FE")}
                    className="dropdown-item"
                  >
                    Front End
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => categoryField("BE")}
                    className="dropdown-item"
                  >
                    Back End
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => categoryField("Data")}
                    className="dropdown-item"
                  >
                    Data
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => categoryField("Devops")}
                    className="dropdown-item"
                  >
                    Devops
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-12 mb-3">
            <label htmlFor="" className="form-label">
              Description
            </label>
            <textarea
              name=""
              id="exampleFormControlTextarea1"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
            ></textarea>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="" className="form-label"></label>
            <input
              type="number"
              name="Copies"
              required
              onChange={(e) => setCopies(Number(e.target.value))}
              value={copies}
              className="form-control"
            />
          </div>

          <input type="file" onChange={(e) => base64ConversionForImages(e)} />
          <div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
