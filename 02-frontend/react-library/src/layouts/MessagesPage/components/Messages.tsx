import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoader } from "../../Utils/SpinnerLoader";

export const Messages = () => {
  const { authState } = useOktaAuth();

  const [messages, setMessages] = useState<MessageModel[]>([]);

  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  const [httpError, setHttpError] = useState(null);

  const [messagesPerPage] = useState(5);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUserMessages = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${
          process.env.REACT_APP_API
        }/messages/search/findByUserEmail/?userEmail=${
          authState.accessToken?.claims.sub
        }&page=${currentPage - 1}&size=${messagesPerPage}`;

        const requestOptions = {
          method: "GET",
          Headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const messagesReponse = await fetch(url, requestOptions);

        if (!messagesReponse.ok) {
          throw new Error("Something went wrong!");
        }

        const responseJson = await messagesReponse.json();

        setMessages(responseJson._embedded.messages);
        setTotalPages(responseJson.page.totalPages);
        setIsLoadingMessage(false);
      }
    };

    window.scrollTo(0, 0);

    fetchUserMessages().catch((err: any) => {
      setIsLoadingMessage(true);
      setHttpError(err.message);
    });
  }, [authState, currentPage]);

  if (isLoadingMessage) {
    return <SpinnerLoader />;
  }

  if (httpError) {
    return <p className="m-3">{httpError}</p>;
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-2">
      {messages.length > 0 ? (
        <>
          <h5>Current Q/A:</h5>
          {messages.map((msg) => (
            <div key={msg.id}>
              <div className="card mt-2 shadow p-3 bg-body rounded">
                <h5>
                  Case #{msg.id}: {msg.title}
                </h5>
                <h6>{msg.userEmail}</h6>
                <p>{msg.question}</p>
                <hr />
                <div>
                  <h5>Response: </h5>
                  {msg.response && msg.adminEmail ? (
                    <>
                      <h6>{msg.adminEmail} (admin)</h6>
                      <p>{msg.response}</p>
                    </>
                  ) : (
                    <p>
                      <i>
                        Pending response from administration. Please be patient
                      </i>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <h5>All questions you submit will be shown here.</h5>
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
