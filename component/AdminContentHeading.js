import React from "react";
import styled from "styled-components";
import parser from "html-react-parser";

const AdminContentHeading = (props) => {
  return (
    <Heading>
      <div className="row mb-2 mb-xl-3">
        <div className="float-start">
          <i className="text-style">{props.heading}</i>
          <span>{parser(props.subheading)}</span>
        </div>
      </div>
    </Heading>
  );
};

const Heading = styled.div`
  a{
    color:#a14243!important;
  }
  .text-style{
    font-size: 25px;
    color: #a14243!important;
  }
  /* span {
    display: inline;
    font-size: 18px;
    position: relative;
    top: -4px;
    color: gray;

    a {
      color: gray;
      text-decoration: none;
    }
  } */
`;

export default AdminContentHeading;
