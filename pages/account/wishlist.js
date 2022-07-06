import { getSession } from "next-auth/client";
import { connect } from "react-redux";
import { useState } from "react";
import WishlistItem from "../../component/Wishlist/WishlistItem";
import withAuth from "../../component/withAuth";
import SignOut from "../../component/SignOut";
import Pagination from "../../component/Pagination";
import ReactPaginate from "react-paginate";
import Head from "next/head";

let dataLimit = 5;
const Wishlist = (props) => {
  const { wishlists } = props.wishlists;
  // const [currentPage, setCurrentPage] = useState(1);
  // const paginationData = () => {
  //   const startIndex = currentPage * dataLimit - dataLimit;
  //   const endIndex = startIndex + dataLimit;
  //   return wishlists.slice(startIndex, endIndex);
  // };

  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 4;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(wishlists.length / usersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  return (  
    <>
      <Head>
        <title>Vaistra Ecommerce | Wishlists</title>
      </Head>
      <section className="col-lg-8">
        <div className="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 mb-lg-3">
          <h6 className="font-size-base text-dark mb-0">
            List of items you added to wishlist:
          </h6>
          <SignOut label="Sign Out" />
        </div>
        {/* {paginationData().map((wishlist) => {
          return (
            <WishlistItem
              key={wishlist.pId}
              wishlist={wishlist}
              token={props.token}
            />
          );
        })} */}
        {wishlists.slice(pagesVisited, pagesVisited + usersPerPage).map((wishlist) => {
          return (
            <WishlistItem
              key={wishlist.pId}
              wishlist={wishlist}
              token={props.token}
            />
          );
        })}
        {wishlists.length ? (
          // <Pagination
          //   currentPage={currentPage}
          //   pageLimit={5}
          //   pages={Math.ceil(wishlists.length / dataLimit)}
          //   onPageChange={(page) => setCurrentPage(page)}
          // />
          <ReactPaginate
            breakLabel="..."
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={1}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
        ) : (
          <div className="alert alert-danger my-3" role="alert">
            No Product In Wishlist
          </div>
        )}
      </section>
    </>

  );
};

const mapStateToProps = (state) => {
  return {
    wishlists: state.wishlists,
  };
};


export default withAuth(connect(mapStateToProps, null)(Wishlist));
