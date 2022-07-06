import React, { useState, useEffect, useRef } from "react";
import { FaHome, FaPlusCircle, FaReply } from "react-icons/fa";
import styled from "styled-components";
import withAuth from "../../../component/withAuth";
import AdminContentHeading from "../../../component/AdminContentHeading";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import axios from "axios";
import Loader from "../../../component/Loader";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "next-auth/client";
import Head from "next/head";
import Select from "react-select";

toast.configure();

const index = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const statusCheck = [
        { id: "1", value: "All", label: "All" },
        { id: "2", value: "Open", label: "Open" },
        { id: "2", value: "Closed", label: "Closed" }
    ];

    const customStyles = {
        valueContainer: (styles) => ({
            ...styles,
            paddingTop: "0px",
        }),
        control: (styles) => ({
            ...styles,
            backgroundColor: "white",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(204, 210, 219, 0.8)",
            "&:hover": { backgroundColor: "white", cursor: "pointer" },
        }),
        placeholder: (styles) => ({
            ...styles,
            color: "black",
            "&:hover": { backgroundColor: "white" },
        }),
        dropdownIndicator: (styles) => ({
            ...styles,
            color: "black",
            "&:hover": { color: "black" },
        }),
        indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        menu: (styles) => ({
            ...styles,
            position: "absolute",
            top: "30px",
        }),
        singleValue: (styles) => ({ ...styles, color: "black" }),
        input: (styles) => ({ ...styles, color: "black" }),
    };

    const handleChange = async (e) => {
        const TicketsData = localStorage.getItem("TicketsData");
        if (e.value === "All") {
            FetchTicket();
        }
        else {
            const statusValue = JSON.parse(TicketsData).filter((d) => d.status === e.value);
            const dataGet = statusValue.sort((a, b) => {
                return parseInt(b.id) - parseInt(a.id);
            });
            const up = dataGet.map((d, i) => {
                d.srno = i + 1;
                return d;
            });
            setData(up);
        }
    }

    const FetchTicket = async () => {
        setLoading(true);
        const session = await getSession();
        await axios
            .get(
                `${process.env.HOST}/tickets`,
                {
                    headers: {
                        Authorization: session.accessToken,
                    },
                }
            )
            .then(async (res) => {
                setLoading(false);
                localStorage.setItem("TicketsData",JSON.stringify(res.data.data))
                const data = res.data.data.sort((a, b) => {
                    return parseInt(b.id) - parseInt(a.id);
                });
                const up = data.map((d, i) => {
                    d.srno = i + 1;
                    return d;
                });
                setData(up);
            })
            .catch((err) => {
                if (err.response.status === 500) {
                    setLoading(false);
                }
            });
    }


    useEffect(async () => {
        FetchTicket();
    }, []);


    const columns = [
        {
            name: "#",
            selector: "srno",
            sortable: true,
        },
        {
            name: "Subject",
            selector: "subject",
            sortable: true,
        },
        {
            name: "Type",
            selector: "type",
            sortable: true,
        },
        {
            name: "Issue",
            selector: "issue",
            sortable: true,
        },
        {
            name: "Attachment",
            selector: "attachment",
            center: true,
            cell: (row) => (
                row.attachment === null ? "No Attachment Found" :
                    <div className="pt-3 pb-3">
                        <img src={row.attachment} width="70" />
                    </div>
            ),
            export: false
        },
        {
            name: "Status",
            selector: "description",
            sortable: true,
            cell: (row) => (
                <span
                    className={`badge m-0 badge-${row.status === "Open" ? "success" : "secondary"
                        }`}
                >
                    {row.status}
                </span>
            ),
            export: false
        },
        {
            name: "Created At",
            selector: "createdAt",
            cell: (row) => (
                <span>{new Date(row.createdAt).toLocaleDateString()}</span>
            ),
            export: false
        },
        {
            name: "Updated At",
            selector: "updatedAt",
            cell: (row) => (
                <span>{new Date(row.updatedAt).toLocaleDateString()}</span>
            ),
            export: false
        },
        {
            name: "Actions",
            center: true,
            cell: (row) => (
                <>
                    <button
                        className="btn edit"
                        onClick={() => { localStorage.setItem("TicketAid", row.id); router.push("/superadmin/Tickets/postConversation") }}
                    >
                        <FaReply />
                    </button>
                </>
            ),
            export: false
        },
    ];


    const tableData = {
        columns,
        data,
    };

    DataTableExtensions.defaultProps = {
        columns: [],
        data: [],
        filter: true,
        export: true,
        print: true,
        exportHeaders: false,
        children: null,
        filterHidden: true,
        filterPlaceholder: "Search Tickets",
    };

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Tickets List</title>
            </Head>
            <Main className="container-fluid py-4">
                <AdminContentHeading
                    heading={
                        <a href="/superadmin/dashboard">
                            <FaHome />
                        </a>
                    }
                    subheading=" / Tickets List"
                />

                <div className="d-flex justify-content-between mb-4">
                    <button
                        className="btn-sm btn-add"
                        onClick={() => router.push("/superadmin/Tickets/postConversation")}
                    >
                        <i className="pr-1">
                            <FaPlusCircle />
                        </i>
                        Reply to Ticket
                    </button>
                    <div className="select-container">
                        <Select
                            styles={customStyles}
                            id="long-value-select"
                            instanceId="long-value-select"
                            options={statusCheck}
                            key={statusCheck.id}
                            menuShouldBlockScroll={true}
                            defaultValue={statusCheck[0]}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <DataTableExtensions {...tableData}>
                    {loading ? (
                        <Loader />
                    ) : (
                        <DataTable
                            columns={columns}
                            data={data}
                            noHeader
                            defaultSortField="srno"
                            defaultSortAsc={true}
                            pagination
                            highlightOnHover
                        />
                    )}
                </DataTableExtensions>
            </Main>
        </>
    );
};

const Main = styled.div`
  img{
    width: 70px !important;
  }
`;

export default withAuth(index);
