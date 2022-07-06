import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import SignOut from "../../component/SignOut";
import withAuth from "../../component/withAuth";
import { fetchOrder } from "../../Redux/Account/accountActions";
import Head from "next/head";
import ViewOrderDetails from "../../component/ViewOrderDetails";
import styles from "../../styles/Rutvik.module.css";
import Spinner from "../../component/Spinner";
import Loader from "../../component/Loader";
import ReactPaginate from "react-paginate";

const Order = (props) => {
    const { orders } = props.orders;

    const [data, setData] = useState([]);
    // const [finalData, setFinalData] = useState(orders);
    const [orderId, setOrderId] = useState("");
    const [final, setfinal] = useState([]);

    useEffect(() => {
        setData(orders);
        setfinal(orders)
    });

    const sortOrders = [
        { name: "All" },
        { name: "Delivered" },
        { name: "Pending" },
        { name: "In Progress" },
        { name: "Delayed" },
        { name: "Canceled" },
    ];

    const orderStatusChangeHandler = (e) => {
        const status = e.target.value;
        if (e.target.value === "All") {
            // alert("all")
            setData(orders);
            // console.log(orders)
        } else if (e.target.value === "Pending") {
            // alert("pen")
            // debugger
            const update = final.filter((item) => item.paid === null);
            const up = update.map((d, i) => {
                d.srno = i + 1;
                return d;
            });
            // console.log('up',up);
            setData(up);
        } else if (e.target.value === "In Progress") {
            // alert("in")
            // debugger
            const update = final.filter((item) => item.paid === "Yes");
            const up = update.map((d, i) => {
                d.srno = i + 1;
                return d;
            });
            // console.log('up',up);
            setData(up);
        } else {
            // alert("else")
            setData()

        }
    };

    const longDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

    const [currentPage, setcurrentPage] = useState(0);
    // const [itemsPerPage, setitemsPerPage] = useState(10);

    // const [pageNumberLimit, setpageNumberLimit] = useState(2);
    // const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(2);
    // const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

    // const handleClick = (event) => {
    //     setcurrentPage(Number(event.target.id));
    // };

    // React paginate
    const usersPerPage = 10;
    const pageCount = Math.ceil(orders.length / usersPerPage);
    const pagesVisited = currentPage * usersPerPage;
    // const [pageNumber, setPageNumber] = useState(0);
    const changePage = ({ selected }) => {
        setcurrentPage(selected);
    };
    // React paginate

    // const pages = [];
    // for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    //     pages.push(i);
    // }

    const renderData = (data) => {
        // console.log(data.length)
        return (<>
            {
                data.length !== 0 ?
                    (
                        data.map((d) => {
                            return (
                                <>


                                    <tbody>
                                        <tr key={d.id}>
                                            <td className="py-3">
                                                <a
                                                    className="nav-link-style font-weight-medium font-size-sm"
                                                    href="#order-details"
                                                    data-toggle="modal"
                                                    onClick={(e) => setOrderId(e.target.innerText)}
                                                >
                                                    {d.orderId}
                                                </a>
                                            </td>
                                            <td className="py-3">
                                                {longDate.format(new Date(d.datePurchased))}
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`badge m-0 badge-${d.paid === "In Progress"
                                                        ? "info"
                                                        : d.paid === "Canceled"
                                                            ? "danger"
                                                            : d.paid === "Delayed"
                                                                ? "warning"
                                                                : "success"
                                                        }`}
                                                >
                                                    {d.paid ? "Paid" : "Pending"}
                                                </span>
                                            </td>
                                            <td className="py-3">₹{d.total}</td>
                                        </tr>
                                    </tbody>

                                </>
                            )
                        })
                    ) : <div className="alert alert-danger my-3" role="alert">
                        No Order Found...
                    </div>
            }
        </>
        )
    }

    // const indexOfLastItem = currentPage * usersPerPage;
    // const indexOfFirstItem = indexOfLastItem - usersPerPage;
    // const currentItem = data.slice(indexOfFirstItem, indexOfLastItem);
    const currentItem = data.slice(pagesVisited, pagesVisited + usersPerPage);
    

    // const renderPageNumbers = pages.map((number) => {
    //     if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
    //         return (
    //             <li key={number} id={number} onClick={handleClick} className={currentPage == number ? "active" : null}>
    //                 {number}
    //             </li>
    //         );
    //     } else {
    //         return null;
    //     }
    // });

    // const handleNextbtn = () => {
    //     setcurrentPage(currentPage + 1);

    //     if (currentPage + 1 > maxPageNumberLimit) {
    //         setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
    //         setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    //     }
    // };

    // const handlePrevbtn = () => {
    //     setcurrentPage(currentPage - 1);

    //     if ((currentPage - 1) % pageNumberLimit == 0) {
    //         setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
    //         setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    //     }
    // };

    // let pageIncrementBtn = null;
    // if (pages.length > maxPageNumberLimit) {
    //     pageIncrementBtn = <li onClick={handleNextbtn}> &hellip; </li>;
    // }

    // let pageDecrementBtn = null;
    // if (minPageNumberLimit >= 1) {
    //     pageDecrementBtn = <li onClick={handlePrevbtn}> &hellip; </li>;
    // }

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Orders</title>
            </Head>
            <ViewOrderDetails orderId={orderId} />
            <section className="col-lg-8">
                <div className="d-flex justify-content-between align-items-center pt-lg-2 pb-4 mb-lg-3">
                    <div className="form-inline">
                        <label className="text-dark opacity-75 text-nowrap mr-2 d-none d-lg-block" htmlFor="order-sort" >
                            Sort orders:
                        </label>
                        <select className="form-control custom-select" id="order-sort" onChange={(e) => orderStatusChangeHandler(e)} >
                            {sortOrders.map((so) => {
                                return (
                                    <option value={so.name} key={so.name}>
                                        {so.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <SignOut label="Sign Out" />
                </div>
                <div className="table-responsive font-size-md">
                    <table className="table table-hover mb-0">
                        {props.orders.loading ? (
                            <center>
                                {/* <Spinner /> */}
                                <Loader />
                            </center>
                        ) : !data.length ? (
                            <div className="alert alert-danger my-3" role="alert">
                                No Orders Found
                            </div>
                        ) : (
                            <>
                                <thead>
                                    <tr>
                                        <th>Order #</th>
                                        <th>Date Purchased</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                {renderData(currentItem)}
                            </>
                        )}
                    </table>
                </div>
                <hr className="mb-4" />
                {data.length === 0 ? (
                    ""
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
                    // <ul className="pageNumbers" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    //     <li>
                    //         <button onClick={handlePrevbtn}
                    //             disabled={
                    //                 currentPage == pages[0] ? true : false
                    //             }
                    //         >
                    //             Previous
                    //         </button>
                    //     </li>
                    //     {pageDecrementBtn}
                    //     {renderPageNumbers}
                    //     {pageIncrementBtn}

                    //     <li>
                    //         <button onClick={handleNextbtn}
                    //             disabled={
                    //                 currentPage == pages[pages.length - 1]
                    //                     ? true
                    //                     : false
                    //             }
                    //         >
                    //             Next
                    //         </button>
                    //     </li>
                    // </ul>
                )}
            </section>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        orders: state.orders,
    };
};

export default withAuth(connect(mapStateToProps, null)(Order));
