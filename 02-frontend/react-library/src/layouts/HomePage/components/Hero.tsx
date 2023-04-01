import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  const { authState } = useOktaAuth();
  return (
    <div className="m-2">
      <div className="d-none d-lg-block">
        <div className="row g-0 mt-5">
          <div className="col-sm-6 col-md-6">
            <div className="col-image-left"></div>
          </div>
          <div className="col-4 col-md-4 container d-flex justify-content-center align-items center">
            <div className="ml-2">
              <h1>What have you been reading?</h1>
              <p className="lead">
                The library team would love to know what you have been reading.
                Whether it is to learn a new skill or grow within one, we will
                be providing top content for you!
              </p>
              {!authState?.isAuthenticated ? (
                <Link to="/login" className="btn main-color btn-lg text-white">
                  Sign up
                </Link>
              ) : (
                <Link
                  type="button"
                  to="/search"
                  className="btn main-color btn-lg text-white"
                >
                  Explore top books
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="row g-0">
          <div className="col-4 col-md-4 container d-flex justify-content-center align-items center">
            <div className="ml-2">
              <h1>Our collection is always changing!</h1>
              <p className="lead">
                Try to check in daily as our collection is always changing! we
                work non stop to provide accurate book selection possible for
                love 2 read students! We are diligent about our book selection
                and our books are always going to be our top priority
              </p>
            </div>
          </div>
          <div className="col-sm-6 col-md-6">
            <div className="col-image-right"></div>
          </div>
        </div>
      </div>

      {/*Mobile Heros */}

      <div className="d-lg-none mt-5">
        <div className="container">
          <div>
            <div className="col-image-left"></div>

            <div className="mt-2">
              <h1>What have you been reading?</h1>
              <p className="lead">
                The library team would love to know what you have been reading.
                Whether it is to learn a new skill or grow within one, we will
                be providing top content for you!
              </p>
            </div>
                </div>

            <div>
              <div className="col-image-right"></div>

              <div className="mt-2">
                <h1>Our collection is always changing!</h1>
                <p className="lead">
                  Try to check in daily as our collection is always changing! we
                  work non stop to provide accurate book selection possible for
                  love 2 read students! We are diligent about our book selection
                  and our books are always going to be our top priority
                </p>
              </div>
            </div>
          </div>
        </div>
       </div>
  );
};
