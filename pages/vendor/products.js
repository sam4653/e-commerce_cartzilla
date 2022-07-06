import { connect } from "react-redux";
import withAuth from "../../component/withAuth";
import GetProducts from "../../component/vendor/GetProducts";
import React, { useState, useEffect } from "react";
import { removeProduct } from "../../Redux/Product/productAction";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import Head from "next/head";
import Portal from "../../component/Portal";

const products = (props) => {
    const [pageNumber, setPageNumber] = useState(0);
    const productsPerPage = 3;
    const pagesVisited = pageNumber * productsPerPage;
    const [id, setId] = useState(0);

    const numbersss = localStorage.getItem("pageNo")
    useEffect(() => {
        setPageNumber(numbersss);
        localStorage.setItem("pageNo", pageNumber);
    }, []);

    const displayData = props.products.products
        .slice(pagesVisited, pagesVisited + productsPerPage)
        .map((product, i) => {
            return (
                <GetProducts key={i} product={product} token={props.token} page={pageNumber} setId={setId} />
            );
        });

    const pageCount = Math.ceil(
        props.products.products.length / productsPerPage,
    );

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Products</title>
            </Head>
            <section className="col-lg-8">
                <Main>
                    <div className="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 mb-lg-3">
                        <h2 className="h3 pt-2 mb-0 text-center text-sm-left">
                            Products
                            <span className="badge badge-secondary font-size-sm text-body align-middle ml-2">
                                {props.products.products.length}
                            </span>
                        </h2>
                    </div>
                    <hr />
                    {displayData}
                    {props.products.products.length === 0 ? (
                        <div className="alert alert-danger my-3" role="alert">
                            No Products Found
                        </div>
                    ) : (
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
                            initialPage={Number(numbersss)}
                            nextLinkClassName={"nextBttn"}
                            disabledClassName={"paginationDisabled"}
                            activeClassName={"paginationActive"}
                        />
                    )}
                </Main>
                <Portal>
                <div id="myModal" className="modal fade">
                <div className="modal-dialog modal-confirm modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header flex-column">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <div className="icon-box">
                                <i className="czi-trash h2 text-danger"></i>
                                {/* <h4 className="modal-title w-100 text-center">Are you sure?&nbsp;&nbsp;</h4> */}
                            </div>
                        </div>
                        <div className="modal-body text-center">
                            <p>Do you really want to delete these Product?</p>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => {
                                console.log("id",id)
                                props.removeProduct({
                                    token: props.token,
                                    id,
                                });
                            }}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
                </Portal>
            </section>
        </>
    );
};

const Main = styled.div`
    .paginationBttns {
        width: 80%;
        height: 40px;
        list-style: none;
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    .paginationBttns a {
        padding: 10px;
        margin: 8px;
        border-radius: 5px;
        border: 1px solid #fe696a;
        color: #fe696a;
        cursor: pointer;
    }

    .paginationBttns a:hover {
        color: white;
        background-color: #fe696a;
    }

    .paginationActive a {
        color: white;
        background-color: #fe696a;
    }

    .paginationDisabled a {
        cursor: not-allowed;
    }
    .paginationDisabled a:hover {
        color: #fe696a;
        background: white;
    }
`;

const mapStateToProps = (state) => {
    return {
        products: state.products,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        removeProduct: (data) => dispatch(removeProduct(data)),
    };
};

export default withAuth(connect(mapStateToProps,mapDispatchToProps)(products));
