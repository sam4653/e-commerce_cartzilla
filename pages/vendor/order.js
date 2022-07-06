import { connect } from "react-redux";
import withAuth from "../../component/withAuth";
import OrderItem from "../../component/vendor/OrderItem";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import React, { useState } from "react";
import Head from "next/head";
import ReactLoading from "react-loading";

const order = ({ orders }) => {
    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 5;
    const pagesVisited = pageNumber * usersPerPage;
    const displayData = orders.orders
        .slice(pagesVisited, pagesVisited + usersPerPage)
        .map((order) => {
            return <OrderItem key={order.pId} order={order} pageNumber={pageNumber} />;
        });
console.log("displayData",displayData)
    const pageCount = Math.ceil(orders.orders.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Orders</title>
            </Head>
            <Main className="col-lg-8">
                <section>
                    <div className="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 mb-lg-3">
                        <h2 className="h3 pt-2 mb-0 text-center text-sm-left">
                            Orders
                            <span className="badge badge-secondary font-size-sm text-body align-middle ml-2">
                                {orders.orders.length}
                            </span>
                        </h2>
                    </div>
                    <hr />
                    {displayData}
                    {orders.loading ? (
                        // <p className="text-center">
                        //     {" "}
                        //     Your Orders - Loading...{" "}
                        // </p>
                        <div className="loadingBars">
                            <ReactLoading type="bars" color="#666362"
                                height={100} width={70} />
                        </div>
                    ) : orders.orders.length === 0 && !orders.loading ? (
                        <div className="alert alert-danger my-3" role="alert">
                            Sorry! No Orders Found
                        </div>
                    ) : (
                        <ReactPaginate
                            breakLabel="..."
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={1}
                            onPageChange={changePage}
                            containerClassName={"paginationBttns"}
                            previousLinkClassName={"previousBttn"}
                            nextLinkClassName={"nextBttn"}
                            disabledClassName={"paginationDisabled"}
                            activeClassName={"paginationActive"}
                        />
                    )}
                </section>
            </Main>
        </>
    );
};

const Main = styled.div``;

const mapStateToProps = (state) => {
    return {
        orders: state.orders,
    };
};

export default withAuth(connect(mapStateToProps, null)(order));
