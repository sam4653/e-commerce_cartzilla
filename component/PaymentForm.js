import React from "react";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "./utils";

const PaymentForm = ({ data }) => {
  return (
    <div>
      <div id="PaymentForm" className="my-4">
        <Cards
          cvc={data.cvc}
          expiry={data.expiry}
          focused={data.focus}
          name={data.name}
          number={data.number}
          issuer="visa"
        />
      </div>
    </div>
  );
};

export default PaymentForm;
