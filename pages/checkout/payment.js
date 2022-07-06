import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import PaymentForm from "../../component/PaymentForm";
import Toast from "../../component/Toast";
import { addCheckoutPayment } from "../../Redux/Checkout/checkoutActions";

import {
  formatCreditCardNumber,
  formatCVC,
  formateFullName,
  formatExpirationDate,
} from "../../component/utils";
import { connect } from "react-redux";
import axios from "axios";
import Head from "next/head";

const Payment = (props) => {
  const { checkout } = props;

  const router = useRouter();

  const submitCardDetailRef = useRef(null);
  const [cardData, setCardData] = useState({
    cvc: checkout.payment.cvc ? checkout.payment.cvc : "",
    expiry: checkout.payment.expiry ? checkout.payment.expiry : "",
    focus: "",
    name: checkout.payment.name ? checkout.payment.name : "",
    number: checkout.payment.number ? checkout.payment.number : "",
  });

  // useEffect(() => {
  //   if (!props.carts.carts.length) {
  //     router.replace("/cart");
  //     return null;
  //   }
  // }, []);

  const handleInputFocus = (e) => {
    setCardData((prev) => ({ ...prev, focus: e.target.name }));
  };
  const handleInputChange = ({ target }) => {
    if (target.name === "number") {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === "expiry") {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === "cvc") {
      target.value = formatCVC(target.value);
    } else if (target.name === "name") {
      target.value = formateFullName(target.value);
    }

    setCardData((prev) => ({ ...prev, [target.name]: target.value }));
  };

  const handleSubmit = () => {
    if (
      !cardData.number ||
      !cardData.name ||
      !cardData.expiry ||
      !cardData.cvc
    ) {
      Toast("Please, Fill All The Details");
      return;
    }
    props.addCheckoutPayment({ data: cardData });
    router.push("/checkout/review");
  };

  const addCardDetails = async () => {
    submitCardDetailRef.current.disabled = true;
    const data = {
      cardNumber: cardData.number,
      fullName: cardData.name,
      validThru: cardData.expiry,
      cvc: cardData.cvc,
    };

    await axios
      .post(`${process.env.HOST}/card`, data, {
        headers: {
          Authorization: props.user.token,
        },
      })
      .then((res) => {
        Toast(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        Toast(err.response.data.message);
      });
    submitCardDetailRef.current.disabled = false;
  };
  return (
    <>
      <Head>
        <title>Vaistra Ecommerce | Payment</title>
      </Head>
      <div>
        <h2 className="h6 pb-3 mb-2">Choose payment method</h2>
        <div className="accordion mb-2" id="payment-method" role="tablist">
          <div className="card">
            <div className="card-header" role="tab">
              <h3 className="accordion-heading">
                <a href="#card" data-toggle="collapse">
                  <i className="czi-card font-size-lg mr-2 mt-n1 align-middle" />
                  Pay with Credit Card
                  <span className="accordion-indicator" />
                </a>
              </h3>
            </div>
            <div
              className="collapse show"
              id="card"
              data-parent="#payment-method"
              role="tabpanel"
            >
              <div className="card-body">
                <p className="font-size-sm">
                  We accept following credit cards:&nbsp;&nbsp;
                  <img
                    className="d-inline-block align-middle"
                    src="/img/cards.png"
                    style={{ width: "187px" }}
                    alt="Credit Cards"
                  />
                </p>
                <PaymentForm data={cardData} />

                <form className="interactive-credit-card row">
                  <div className="form-group col-sm-6">
                    <input
                      type="tel"
                      name="number"
                      className="form-control"
                      placeholder="Card Number"
                      pattern="[\d| ]{16,22}"
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                  </div>
                  <div className="form-group col-sm-6">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Full Name"
                      required
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                  </div>
                  <div className="form-group col-sm-3">
                    <input
                      type="tel"
                      name="expiry"
                      className="form-control"
                      placeholder="Valid Thru"
                      pattern="\d\d/\d\d"
                      required
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                  </div>
                  <div className="form-group col-sm-3">
                    <input
                      type="tel"
                      name="cvc"
                      className="form-control"
                      placeholder="CVC"
                      pattern="\d{3,4}"
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                  </div>
                  <div className="col-sm-6">
                    <button
                      className="btn btn-outline-primary btn-block mt-0"
                      type="submit"
                      ref={submitCardDetailRef}
                      onClick={addCardDetails}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header" role="tab">
              <h3 className="accordion-heading">
                <a className="collapsed" href="#paypal" data-toggle="collapse">
                  <i className="czi-paypal mr-2 align-middle" />
                  Pay with PayPal
                  <span className="accordion-indicator" />
                </a>
              </h3>
            </div>
            <div
              className="collapse"
              id="paypal"
              data-parent="#payment-method"
              role="tabpanel"
            >
              <div className="card-body font-size-sm">
                <p>
                  <span className="font-weight-medium">PayPal</span> - the safer,
                  easier way to pay
                </p>
                <form className="row" method="post">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="email"
                        placeholder="E-mail"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div
                      className="
                          d-flex
                          flex-wrap
                          justify-content-between
                          align-items-center
                        "
                    >
                      <a className="nav-link-style" href="#">
                        Forgot password?
                      </a>
                      <button className="btn btn-primary" type="submit">
                        Log In
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header" role="tab">
              <h3 className="accordion-heading">
                <a className="collapsed" href="#points" data-toggle="collapse">
                  <i className="czi-gift mr-2" />
                  Redeem Reward Points
                  <span className="accordion-indicator" />
                </a>
              </h3>
            </div>
            <div
              className="collapse"
              id="points"
              data-parent="#payment-method"
              role="tabpanel"
            >
              <div className="card-body">
                <p>
                  You currently have
                  <span className="font-weight-medium">&nbsp;384</span>
                  &nbsp;Reward Points to spend.
                </p>
                <div className="custom-control custom-checkbox d-block">
                  <input
                    className="custom-control-input"
                    type="checkbox"
                    id="use_points"
                  />
                  <label className="custom-control-label" htmlFor="use_points">
                    Use my Reward Points to pay for this order.
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-none d-lg-flex pt-4">
          <div className="w-50 pr-3">
            <Link href="/checkout/shipping">
              <a
                className="btn btn-secondary btn-block"
              >
                <i className="czi-arrow-left mt-sm-0 mr-1" />
                <span className="d-none d-sm-inline">Back to Shipping</span>
                <span className="d-inline d-sm-none">Back</span>
              </a>
            </Link>
          </div>
          <div className="w-50 pl-2">
            <button
              type="button"
              style={{ width: "100%" }}
              onClick={handleSubmit}
            >
              <a
                className="btn btn-primary btn-block"
              >
                <span className="d-none d-sm-inline">Review your order</span>
                <span className="d-inline d-sm-none">Review order</span>
                <i className="czi-arrow-right mt-sm-0 ml-1" />
              </a>
            </button>
          </div>
        </div>
      </div>
    </>

  );
};

const mapStateToProps = (state) => {
  return {
    checkout: state.checkout,
    user: state.user,
    carts: state.carts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCheckoutPayment: (checkout) => dispatch(addCheckoutPayment(checkout)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Payment);
