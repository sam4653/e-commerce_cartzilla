import { useEffect } from "react";
import React from "react";
import { FaLayerGroup, FaShoppingBag, FaEllipsisV, FaTicketAlt } from "react-icons/fa";
import { FiList } from "react-icons/fi"
import styled from "styled-components";
import withAuth from "../../component/withAuth";
import router, { useRouter } from "next/router";
import Head from "next/head";

const dashboard = () => {

  const router = useRouter();
  return (
    <>
      <Head>
        <title>Vaistra Ecommerce | Dashboard</title>
      </Head>
      <Main className="container-fluid py-4">
        <div className="row">

          <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12  col-xs-12">
            <div
              className="card p-3"
              onClick={() => {
                router.push("/superadmin/Category");
              }}
            >
              <div className="card-body  d-flex flex-column justify-content-between">
                <h3 className="card-title mb-5">Manage Category</h3>

                <div className="mb-0 d-flex justify-content-between align-items-center">
                  <span className="text-muted">Manage Category</span>
                  <i className="icon">
                    <FaEllipsisV />
                  </i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-xs-12">
            <div
              className="card  p-3"
              onClick={() => {
                router.push("/superadmin/Product");
              }}
            >
              <div className="card-body d-flex flex-column justify-content-between">
                <h3 className="card-title mb-5">Manage Products</h3>
                <div className="mb-0 d-flex justify-content-between align-items-center">
                  <span className="text-muted">Manage Products</span>
                  <i className="icon">
                    <FaLayerGroup />
                  </i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12  col-xs-12">
            <div
              className="card p-3"
              onClick={() => {
                router.push("/admin/order");
              }}
            >
              <div className="card-body  d-flex flex-column justify-content-between">
                <h3 className="card-title mb-5">Manage Orders</h3>

                <div className="mb-0 d-flex justify-content-between align-items-center">
                  <span className="text-muted">Manage Orders</span>
                  <i className="icon">
                    <FaShoppingBag />
                  </i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12  col-xs-12">
            <div
              className="card p-3"
              onClick={() => {
                router.push("/superadmin/Tickets");
              }}
            >
              <div className="card-body  d-flex flex-column justify-content-between">
                <h3 className="card-title mb-5">Manage Tickets</h3>

                <div className="mb-0 d-flex justify-content-between align-items-center ">
                  <span className="text-muted">Manage Tickets</span>
                  <i className="icon">
                    <FaTicketAlt />
                  </i>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Main>
    </>
  );
};

const Main = styled.div`

  .card {
    margin-bottom: 24px;
    box-shadow: 0 0 0.875rem 0 rgb(33 37 41 / 5%);
    cursor: pointer;
    height: 230px;
  }

  .icon {
    background-color: #a14243;
    color: #fff;
    display: flex;
    padding: 15px;
    border-radius: 50px;
  }
`;

export default withAuth(dashboard);
