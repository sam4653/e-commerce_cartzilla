import React, { useState, useEffect } from 'react'
import styled from "styled-components";
import withAuth from '../../../component/withAuth';
import Spinner from '../../../component/Spinner';
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import BackButton from '../../../component/BackButton';
import Loader from '../../../component/Loader';
import AdminContentHeading from '../../../component/AdminContentHeading';
import Head from 'next/head';
import { FaHome } from "react-icons/fa";
import { getSession } from "next-auth/client";
import TicketChat from '../../../component/TicketChat';

const postConversation = () => {

  return (
    <Main>
      <Head>
        <title>Vaistra Ecommerce | Ticket Reply</title>
      </Head>
      <AdminContentHeading
        heading={
          <a href="/superadmin/dashboard">
            <FaHome />
          </a>
        }
        subheading=" / Tickets List"
      />
      <div className="container">
        <div className="row" style={{ marginTop: `90px` }}>
          <div className="col-md-12">
            <div className="form-design">
              <h4 className="mb-5 text-center">Tickets Reply</h4>
              <div className=" px-3 d-flex justify-content-end">
                <BackButton />
              </div>
              <div className="row">
              </div>
              <TicketChat Ticketid={localStorage.getItem("TicketAid")}/>
            </div>
          </div>

        </div>
      </div>

    </Main>
  )
}

const Main = styled.div`
  
`;

export default postConversation