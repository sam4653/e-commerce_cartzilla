import { useEffect, useState, useRef } from "react";
import withAuth from "../../component/withAuth";
import axios from "axios";
import { connect } from "react-redux";
import SignOut from "../../component/SignOut";
import Portal from "../../component/Portal";
import { getSession } from "next-auth/client";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import { useRouter } from "next/router";
import Head from "next/head";
import { FaReply } from "react-icons/fa";

const Tickets = (props) => {

  const router = useRouter();
  const sortType = [{ name: "All" }, { name: "Open" }, { name: "Closed" }];
  const [data, setData] = useState([]);
  const [dataLength, setDataLength] = useState("");
  const [loading, setloading] = useState(false)
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;

  const pageCount = Math.ceil(dataLength / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };


  const FetchTicket = async () => {
    const sess = await getSession();
    await axios
      .get(`${process.env.HOST}/user-tickets`, {
        headers: {
          Authorization: sess.accessToken,
        },
      })
      .then((res) => {
        setDataLength(res.data.data.length);
        setData(res.data.data);
        // console.log("dataofticket",res.data.data);
        setloading(true)
      })
      .catch((err) => {
        console.log(err.response);
        setloading(false)
      });
  };

  useEffect(async () => {
    FetchTicket();
  }, []);

  const orderStatusChangeHandler = async (e) => {
    if (e.target.value === "All") {
      FetchTicket();
    } else {
      const sess = await getSession();
      await axios
        .get(`${process.env.HOST}/tickets/byStatus/${e.target.value}`, {
          headers: {
            Authorization: sess.accessToken,
          },
        })
        .then((res) => {
          // console.log("statusticket",res.data.data);
          setDataLength(res.data.data.length);
          setData(res.data.data);
          setloading(true)
        })
        .catch((err) => {
          console.log(err.response);
          setloading(false)
        });
    }
  };

  return (
    <>
      <Head>
        <title>Vaistra Ecommerce | Tickets</title>
      </Head>
      <Main>
        <section className="col-lg-12">
          <div className="d-flex justify-content-between align-items-center pt-lg-2 pb-4 pb-lg-5 mb-lg-3">
            <div className="form-inline">
              <label
                className="text-dark opacity-75 text-nowrap mr-2 d-none d-lg-block"
                htmlFor="order-sort"
              >
                Sort orders:
              </label>
              <select
                className="form-control custom-select"
                id="order-sort"
                onChange={(e) => orderStatusChangeHandler(e)}
              >
                {sortType.map((order) => {
                  return (
                    <option value={order.name} key={order.name}>
                      {order.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <SignOut label="Sign Out" />
          </div>

          {
            loading ? <div>  <div className="table-responsive" style={{ maxWidth: "92vw" }}>
              <table className="table table-hover  mb-0">
                <thead>
                  <tr>
                    <th>Ticket Subject</th>
                    <th>Date Submitted</th>
                    <th>Type</th>
                    <th>Status</th>
                    {/* <th>Priority</th> */}
                    <th>Reply To Ticket</th>
                  </tr>
                </thead>
                {dataLength === 0
                  ? <div className="alert alert-danger my-3" role="alert">
                    No Tickets Found
                  </div>
                  : data
                    .slice(pagesVisited, pagesVisited + usersPerPage)
                    .map((d, i) => {

                      return (
                        <tbody key={i}>
                          <tr>
                            <td className="py-3">
                              <a
                                className="nav-link-style font-weight-medium"
                                href="#"
                              >
                                {d.subject}
                              </a>
                            </td>
                            <td className="py-3">
                              {new Date(d.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3">
                              <span className="badge badge-warning m-0">
                                {d.type}
                              </span>
                            </td>
                            <td className="py-3">
                              <span
                                className={`badge m-0 badge-${d.status === "Open" ? "success" : "secondary"
                              }`}
                              >
                                {d.status}
                              </span>
                            </td>
                              {/* <td className="py-3">{d.priority}</td> */}
                            <td className="py-3 text-center">
                              <i className="fa-icons" onClick={() => { localStorage.setItem("TicketUid", d.id); router.push("/account/TicketReply") }}><FaReply /></i>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
              </table>
            </div>
              <hr className="mb-4" />
              {dataLength === 0 ? (
                "No Products Found"
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
                  nextLinkClassName={"nextBttn"}
                  disabledClassName={"paginationDisabled"}
                  activeClassName={"paginationActive"}
                />
              )}

            </div>
              : <div className="alert alert-danger my-3" role="alert">
              No Ticket Found
            </div>
          }

          <div className="text-right py-4">
            <button className="btn btn-primary" onClick={() => router.push("/account/addTicket")}>
              Submit new ticket
            </button>
          </div>
        </section>
      </Main>
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

export default withAuth(Tickets);
