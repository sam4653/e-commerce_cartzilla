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
import Parser from "html-react-parser";
import Head from "next/head";
toast.configure();

const index = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);


  useEffect(async () => {
    setLoading(true);
    const session = await getSession();
    await axios
      .get(
        `${process.env.HOST}/product`,
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
        if (err.response.status === 500) {
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
      name: "Product Name",
      selector: "productName",
      sortable: true,
    },
    {
      name: "Product Description",
      selector: "description",
      sortable: true,
      center: true,
      grow: 2,
      cell: (row) => (
        <div className="pt-3 pb-3">
          <p>{Parser(row.description)}</p>
        </div>
      ),
    },
    {
      name: "Product Price",
      selector: "price",
      sortable: true,
    },
    {
      name: "Product Quantity",
      selector: "quantity",
      sortable: true,
    },
    {
      name: "Product Brand",
      selector: "brand",
      sortable: true,
    },
    {
      name: "Product Category Name",
      selector: "catName",
      sortable: true,
    },
    // {
    //   name: "Product Size",
    //   selector: "size",
    //   sortable: true,
    //   export: false,
    //   cell: (row) => {
    //     // const sizeData = row.size;
    //     // const result = sizeData.replace(/[{}]/g, '');
    //     return <p>{row.size}</p>
    //   },
    // },
    {
      name: "Photo",
      selector: "photo",
      sortable: true,
      center: true,
      // cell: (row) => (
      //   <div className="pt-3 pb-3">
      //     {
      //       row.photo.map((p) => {
      //         return <img src={p} width="70" />
      //       })
      //     }
      //   </div>
      // ),
      cell: (row) => (
        <div className="pt-3 pb-3">
          <img src={row.photo[0]} width="70" />
        </div>
      ),
      export: false
    },

    {
      name: "Product Color",
      selector: "color",
      sortable: true,
      export: false,
      center: true,
      cell: (row) => {
        return (
          <div className="d-flex">
            {
              row.color.map((c,i) => {
                return (
                  <>
                  <div
                  key={i}
                  className="d-flex"
                  style={{
                    width: "30px",
                    objectFit: "contain",
                    height: "30px",
                    background: `${c}`,
                    marginRight: "10px"
                  }}
                />
                  </>
                )
              })
            }

          </div>
        );
      },
    },

    {
      name: "Actions",
      center: true,
      cell: (row) => (
        <>
          <button
            className="btn edit"
            onClick={() => { localStorage.setItem("productEditId", row.id); router.push("/superadmin/Product/edit") }}
          >
            <FaEdit />
          </button>
          <button
            className="btn delete"
            onClick={() => { localStorage.setItem("productId", row.id); setShow(true); }}
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
    filterPlaceholder: "Search Products",
  };

  const handleOpen = async () => {
    setShow(false);
    const productId = localStorage.getItem("productId")
    setLoading(true);
    const session = await getSession();
    await axios
      .delete(`${process.env.HOST}/product/${productId}`, {
        headers: {
          Authorization: session.accessToken,
        },
      })
      .then((res) => {
        setLoading(false);
        const update = data.filter((item) => item.id !== productId);
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
        <title>Vaistra Ecommerce | Product Lists</title>
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
            onClick={() => router.push("/superadmin/Product/add")}
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
