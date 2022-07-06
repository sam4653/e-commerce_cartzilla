import React from "react";

function Pagination({ currentPage, pageLimit, pages, onPageChange }) {
  if (pages < pageLimit) pageLimit = pages;

  const goToNextPage = () => {
    return onPageChange(currentPage + 1);
  };

  const goToPreviousPage = () => {
    return onPageChange(currentPage - 1);
  };

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
  };

  return (
    <nav
      className="d-flex justify-content-between pt-2"
      aria-label="Page navigation"
    >
      <ul className="pagination">
        {pages ? (
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
        ) : (
          ""
        )}
      </ul>
      <ul className="pagination">
        {getPaginationGroup().map((item, index) => {
          return (
            <button onClick={() => onPageChange(item)} key={index}>
              <li
                className={`page-item d-none d-sm-block ${
                  currentPage === item ? "active" : ""
                }`}
              >
                <a className="page-link">{item}</a>
              </li>
            </button>
          );
        })}
      </ul>
      <ul className="pagination">
        {pages ? (
          <button
            onClick={goToNextPage}
            disabled={currentPage >= pages ? true : false}
          >
            <li
              className={`page-item ${currentPage >= pages ? "disabled" : ""}`}
            >
              <a className="page-link" aria-label="Next">
                Next
                <i className="czi-arrow-right ml-2" />
              </a>
            </li>
          </button>
        ) : (
          ""
        )}
      </ul>
    </nav>
  );
}

export default Pagination;
