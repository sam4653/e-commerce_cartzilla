import React, { useState, useEffect, useRef } from 'react'
import styled from "styled-components";
import Spinner from './Spinner';
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { getSession } from "next-auth/client";
import Loader from './Loader';
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";

const TicketChat = (props) => {
    const router = useRouter();
    const [TicketData, setTicketData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mainloader, setMainLoader] = useState(false);
    const [checked, setChecked] = useState(false);
    const [length, setLength] = useState("")
    const btnRef = useRef();
    const [tId, setTId] = useState("");
    const [data, setData] = useState({
        message: "",
        isClosed: checked
    });

    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );

    const TicketSchema = Yup.object().shape({
        message: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the end are not allowed."
            )
            .required("Message is required."),
    });


    useEffect(async () => {

        btnRef.current.disabled = true;
        setMainLoader(true);

        const session = await getSession();

        await axios
            .get(`${process.env.HOST}/ticketConversation/` + props.Ticketid, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                setMainLoader(false);
                setTicketData(res.data.data);
                setLength(res.data.data.length);
                setData(res.data.data);
            })
            .catch((err) => {
                setMainLoader(false);
                if (err.response.status === 404) {
                    setMainLoader(false);
                }
            });
    }, []);

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChecked = () => {
        setChecked(!checked)
        setData((prev) => ({ ...prev, isClosed: checked }));
    }

    const ReplyTicket = async () => {

        const Ticketid = props.Ticketid;
        const session = await getSession();

        setLoading(true);
        btnRef.current.disabled = true;

        await axios
            .post(`${process.env.HOST}/ticketConversation/${Ticketid}`, data, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                setLoading(false);
                btnRef.current.disabled = false;
                toast.info("😊 " + res.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    transition: Flip,
                    onClose: () => {
                        router.push("/superadmin/Tickets");
                    },
                });
                localStorage.removeItem("TicketCId");
            })
            .catch((err) => {
                setLoading(false);
                btnRef.current.disabled = false;
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    transition: Flip,
                });
            });
    }

    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 3;
    const pagesVisited = pageNumber * usersPerPage;

    const pageCount = Math.ceil(length / usersPerPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    return (
        <Main>
            <section className="col-lg-12">
                {
                    mainloader === true ? (
                        <Loader />
                    ) : length === 0 && tId === "" ? <h3>No Ticket Conversations are avaliable</h3> : (
                        <>
                            {
                                TicketData.slice(pagesVisited, pagesVisited + usersPerPage).map((t, index) => {
                                    return (
                                        <>
                                            <div className={`d-flex max-width ${t.user[0].id === "1" ? "justify-content-end" : "justify-content-start"}`} key={index}>
                                                <div className="media pb-4">
                                                    <img
                                                        className="rounded-circle"
                                                        width={50}
                                                        src={t.user[0].photo}
                                                        alt="User Photo"
                                                    />
                                                    <div className="media-body pl-3">
                                                        <h6 className="font-size-md mb-2">{t.user[0].firstName} {t.user[0].lastName}</h6>
                                                        <p className="font-size-md mb-1">
                                                            {t.message}
                                                        </p>
                                                        <span className="font-size-ms text-muted">
                                                            <i className="czi-time align-middle mr-2" />
                                                            {new Date(t.dateTime).toUTCString().slice(0, 25)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </>
                                    )
                                })
                            }
                            {length === 0 ? (
                                "No Ticket Conversations Found"
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
                            <h3 className="h5 mt-2 pt-4 pb-2">Leave a Message {tId}</h3>
                            <Formik
                                initialValues={{
                                    message: data.message,
                                }}
                                validationSchema={TicketSchema}
                                onSubmit={ReplyTicket}
                            >
                                {({ touched, errors, isValid, values, handleChange }) => (
                                    <Form className="needs-validation" autoComplete="off">
                                        <Field
                                            className={`form-control ${touched.message && errors.message ? "is-invalid" : ""
                                                }`}
                                            name="message"
                                            placeholder="Write your message here..."
                                            type="text"
                                            as="textarea"
                                            rows={8}
                                            onChange={(e) => {
                                                handleChange(e);
                                                inputChange(e);
                                            }}
                                        />
                                        <ErrorMessage
                                            component="div"
                                            name="message"
                                            className="invalid-feedback"
                                        />
                                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                                            <div className="custom-control custom-checkbox d-block">
                                                <input
                                                    className="custom-control-input"
                                                    type="checkbox"
                                                    id="close-ticket"
                                                    checked={checked}
                                                    onChange={handleChecked}
                                                />
                                                <label className="custom-control-label" htmlFor="close-ticket">
                                                    Submit and close the ticket
                                                </label>
                                            </div>
                                            <button className="btn btn-primary my-2" type="submit"
                                                disabled={
                                                    !Object.values(values).some(
                                                        (x) => x !== null && x !== ""
                                                    ) ||
                                                    !isValid
                                                }
                                                ref={btnRef}
                                            >
                                                Submit Message
                                                {loading && (
                                                    <Spinner />
                                                )}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </>
                    )
                }
            </section>
        </Main>

    )
}

 const Main = styled.div`
    hr{
        margin-bottom: 20px !important;
    }
    .max-width{
        max-width: 800px !important;
        min-width: 800px !important;
    }
//     .paginationBttns {
//     width: 80%;
//     height: 40px;
//     list-style: none;
//     display: flex;
//     justify-content: center;
//     margin-top: 20px;
//   }

//   .paginationBttns a {
//     padding: 10px;
//     margin: 8px;
//     border-radius: 5px;
//     border: 1px solid #fe696a;
//     color: #fe696a;
//     cursor: pointer;
//   }

//   .paginationBttns a:hover {
//     color: white;
//     background-color: #fe696a;
//   }

//   .paginationActive a {
//     color: white;
//     background-color: #fe696a;
//   }

//   .paginationDisabled a {
//     cursor: not-allowed;
//   }
//   .paginationDisabled a:hover {
//     color: #fe696a;
//     background: white;
//   }
`;

export default TicketChat