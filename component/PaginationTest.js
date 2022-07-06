import React, { useState } from "react";

function Pagination({ data, pageLimit, dataLimit }) {
  clg
  
  const [pages] = useState(Math.round(data.length / dataLimit));
  const [currentPage, setCurrentPage] = useState(1);

  const goToNextPage = () => {
    setCurrentPage((page) => page + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => page - 1);
  };

  const changePage = (event) => {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  };
  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    return data.slice(startIndex, endIndex);
  };
  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
  };

  return (
    <>
      <div className="table-responsive font-size-md">
       <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date Purchased</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedData().map((d, idx) => {
              return (
                <tr key={d.id}>
                  <td className="py-3">
                    <a
                      className="nav-link-style font-weight-medium font-size-sm"
                      href="#order-details"
                      data-toggle="modal"
                    >
                      {d.orderId}
                    </a>
                  </td>
                  <td className="py-3">{d.datePurchased}</td>
                  <td className="py-3">
                    <span
                      className={`badge m-0 badge-${d.status === "In Progress"
                          ? "info"
                          : d.status === "Canceled"
                            ? "danger"
                            : d.status === "Delayed"
                              ? "warning"
                              : "success"
                        }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3">₹{d.total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <hr className="pb-4" />
      <nav
        className="d-flex justify-content-between pt-2"
        aria-label="Page navigation"
      >
        <ul className="pagination">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1 ? true : false}
          >
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <a className="page-link">
                <i className="czi-arrow-left mr-2" />
                Prev
              </a>
            </li>
          </button>
        </ul>
        <ul className="pagination">
          {getPaginationGroup().map((item, index) => {
            return (
              <button onClick={changePage} key={index}>
                <li
                  className={`page-item d-none d-sm-block ${currentPage === item ? "active" : ""
                    }`}
                >
                  <a className="page-link">{item}</a>
                </li>
              </button>
            );
          })}
        </ul>
        <ul className="pagination">
          <button
            onClick={goToNextPage}
            disabled={currentPage > pages ? true : false}
          >
            <li
              className={`page-item ${currentPage > pages ? "disabled" : ""}`}
            >
              <a className="page-link" aria-label="Next">
                Next
                <i className="czi-arrow-right ml-2" />
              </a>
            </li>
          </button>
        </ul>
      </nav>
    </>
  );
}

export default Pagination;
