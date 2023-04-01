import { useOktaAuth } from "@okta/okta-react";
import React, { useEffect, useState } from "react";
import AdminMessageRequest from "../../../models/AdminMessageRequest";
import MessageModel from "../../../models/MessageModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoader } from "../../Utils/SpinnerLoader";
import { AdminMessage } from "./AdminMessage";

export default function AdminMessages() {
  const { authState } = useOktaAuth();

  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const [messages, setMessages] = useState<MessageModel[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [messagesPerPage] = useState(5);

  const [totalPages, setTotalPages] = useState(0);

  const [btnSubmit, setBtnSubmit] = useState(false);

  useEffect(() => {
    const fetchAdminMessages = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${
          process.env.REACT_APP_API
        }/messages/search/findByClosed/?closed=false&page=${
          currentPage - 1
        }&size=${messagesPerPage}`;

        const requestOptions = {
          method: "GET",
          Header: {
            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const messageResponse = await fetch(url, requestOptions);

        if (!messageResponse.ok) throw new Error("Something went wrong!");

        const responseJson = await messageResponse.json();

        setMessages(responseJson._embedded.messages);
        setTotalPages(responseJson.page.totalPages);

        setIsLoadingMessages(false);
      }
    };

    fetchAdminMessages().catch((err: any) => {
      setIsLoadingMessages(false);
      setHttpError(err.message);
    });

    window.scrollTo(0, 0);
  }, [authState, currentPage, btnSubmit]);

  async function addResponseToQuestion(id: number, response: string) {
    if (authState && authState.isAuthenticated) {
      const AdminMessageRequestModel: AdminMessageRequest =
        new AdminMessageRequest(id, response);

      const url = `${process.env.REACT_APP_API}/messages/secure/admin/message`;

      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(AdminMessageRequestModel),
      };

      const responseData = await fetch(url, requestOptions);

      if (!responseData.ok) throw new Error("Something went wrong!");

      setBtnSubmit(!btnSubmit);
    }
  }

  if (isLoadingMessages) {
    return <SpinnerLoader />;
  }

  if (httpError != null) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-3">
      {messages.length > 0 ? (
        <>
          <h5>Pending QnA</h5>
          {messages.map((msg) => (
            <AdminMessage
              message={msg}
              key={msg.id}
              addResponseToQuestion={addResponseToQuestion}
            />
          ))}
        </>
      ) : (
        <h5>No Pending QnA</h5>
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
}
