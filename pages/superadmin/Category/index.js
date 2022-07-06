import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaHome, FaPlusCircle, FaRecycle, FaEdit, FaTrash } from "react-icons/fa";
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
import { Button, Modal } from "react-bootstrap";
import Head from "next/head";
toast.configure();

const index = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const [show, setShow] = useState(false);
    const [modalInfo, setModalInfo] = useState("")
    const handleClose = () => setShow(false);


    useEffect(async () => {
        setLoading(true);
        const session = await getSession();
        await axios
            .get(
                `${process.env.HOST}/categories`,
                {
                    headers: {
                        Authorization: session.accessToken,
                    },
                }
            )
            .then(async (res) => {
                setLoading(false);
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
                if (err.response.status === 404) {
                    setLoading(false);
                }
            });
    }, []);


    const columns = [
        {
            name: "#",
            selector: "srno",
            sortable: true,
        },
        {
            name: "Category Name",
            selector: "name",
            sortable: true,
        },
        {
            name: "Category Description",
            selector: "description",
            sortable: true,
            center: true,
            grow: 2
        },
        {
            name: "Photo",
            selector: "photo",
            sortable: true,
            center: true,
            cell: (row) => (
                <div className="pt-3 pb-3">
                    <img src={row.photo} width="70" />
                </div>
            ),
            export: false
        },

        {
            name: "Actions",
            cell: (row) => (
                <>
                    <button
                        className="btn edit"
                        onClick={() => { localStorage.setItem("categoryEditId", row.id); router.push("/superadmin/Category/editCategory") }}
                    >
                        <FaEdit />
                    </button>
                    <button
                        className="btn delete"
                        onClick={() => { localStorage.setItem("CategoryId", row.id); setShow(true); }}
                    >
                        <FaTrash />
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
        filterPlaceholder: "Search Categories",
    };

    const handleOpen = async () => {
        setShow(false);
        const CategoryId = localStorage.getItem("CategoryId")
        setLoading(true);
        const session = await getSession();
        await axios
            .delete(`${process.env.HOST}/category/${CategoryId}`, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                setLoading(false);
                const update = data.filter((item) => item.id !== CategoryId);
                const up = update.map((d, i) => {
                    d.srno = i + 1;
                    return d;
                });
                setData(up);
            })
            .catch((err) => console.log(err));
    }


    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Categories List</title>
            </Head>
            <Main className="container-fluid py-4">
                <Modal show={show} onHide={handleClose}
                    aria-labelledby="contained-modal"
                    centered className="ModelShare">
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{
                        overflow: 'hidden',
                        padding: '0px',
                        margin: '10px',
                    }}>
                        <h6>Are you sure you want to delete this category ?</h6>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleOpen}>
                            Yes
                        </Button>
                        <Button variant="danger" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <AdminContentHeading
                    heading={
                        <a href="/superadmin/dashboard">
                            <FaHome />
                        </a>
                    }
                    subheading=" / Categories List"
                />

                <div className="d-flex justify-content-between mb-4">
                    <button
                        className="btn-sm  btn-add"
                        onClick={() => router.push("/superadmin/Category/ManageCategory")}
                    >
                        <i className="pr-1">
                            <FaPlusCircle />
                        </i>
                        Add
                    </button>
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
