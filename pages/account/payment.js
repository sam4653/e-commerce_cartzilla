import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Portal from "../../component/Portal";
import Toast from "../../component/Toast";
import withAuth from "../../component/withAuth";
import { getSession } from "next-auth/client";
import Pagination from "../../component/Pagination";
import {
  formatCreditCardNumber,
  formatCVC,
  formateFullName,
  formatExpirationDate,
} from "../../component/utils";
import Spinner from "../../component/Spinner";
import SignOut from "../../component/SignOut";
import Head from "next/head";

let dataLimit = 10;
const Payment = (props) => {
  const [modeOfPaymentAsCard, setModeOfPaymentAsCard] = useState("Paypal");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState({ add: false, delete: false });

  const [session, setSession] = useState();

  const submitCardDetailRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [cardData, setCardData] = useState({
    cvc: "",
    expiry: "",
    name: "",
    number: "",
  });

  useEffect(async () => {
    const sess = await getSession();
    setSession(sess.accessToken);
  }, []);

  useEffect(async () => {
    session &&
      (await axios
        .get(`${process.env.HOST}/cards`, {
          headers: {
            Authorization: session,
          },
        })
        .then((res) => {
          setCards(res.data.data);
        })
        .catch((err) => {
          Toast(err.response.data.message);
        }));
  }, [session]);

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

  const addCardDetails = async () => {
    setLoading((prev) => ({ ...prev, add: true }));
    submitCardDetailRef.current.disabled = true;
    const inputData = {
      cardNumber: cardData.number,
      fullName: cardData.name,
      validThru: cardData.expiry,
      cvc: cardData.cvc,
    };

    await axios
      .post(`${process.env.HOST}/card`, inputData, {
        headers: {
          Authorization: props.token,
        },
      })
      .then((res) => {
        submitCardDetailRef.current.disabled = false;
        setLoading((prev) => ({ ...prev, add: false }));

        Toast(res.data.message);
        setCards((prev) => [...prev, inputData]);
      })
      .catch((err) => {
        setLoading((prev) => ({ ...prev, add: false }));
        console.log(err);
        Toast(err.response.data.message);
      });
  };

  const updateCardDetail = (card) => { };

  const deleteCardDetail = async (id) => {
    setLoading((prev) => ({ ...prev, delete: true }));

    await axios
      .delete(`${process.env.HOST}/card/${id}`, {
        headers: {
          Authorization: props.token,
        },
      })
      .then((res) => {
        setLoading((prev) => ({ ...prev, delete: false }));
        const data = cards.filter((card) => card.id !== id);
        setCards(data);
        Toast(res.data.message);
      })
      .catch((err) => {
        setLoading((prev) => ({ ...prev, add: false }));
        Toast(err.response.data.message);
        console.log(err.response.data);
      });
  };

  const paymentMethodChange = (e) => {
    setModeOfPaymentAsCard(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Vaistra Ecommerce | Payment Methods</title>
      </Head>
      <Portal>
        <div className="modal fade" id="add-payment">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add a payment method</h5>
                <button
                  className="close"
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="custom-control custom-radio mb-4">
                  <input
                    className="custom-control-input"
                    type="radio"
                    id="paypal"
                    name="payment-method"
                    value="Paypal"
                    onChange={paymentMethodChange}
                    checked={modeOfPaymentAsCard === "Paypal"}
                  />
                  <label className="custom-control-label" htmlFor="paypal">
                    PayPal
                    <img
                      className="d-inline-block align-middle ml-2"
                      src="/img/card-paypal.png"
                      width={39}
                      alt="PayPal"
                    />
                  </label>
                </div>
                <div className="custom-control custom-radio mb-4">
                  <input
                    className="custom-control-input"
                    type="radio"
                    id="card"
                    name="payment-method"
                    value="Card"
                    onChange={paymentMethodChange}
                    checked={modeOfPaymentAsCard === "Card"}
                  />
                  <label className="custom-control-label" htmlFor="card">
                    Credit / Debit card
                    <img
                      className="d-inline-block align-middle ml-2"
                      src="/img/cards.png"
                      width={187}
                      alt="Credit card"
                    />
                  </label>
                </div>
                {modeOfPaymentAsCard === "Card" ? (
                  <form
                    className="needs-validation"
                    method="post"
                    tabIndex={-1}
                    noValidate
                  >
                    <div className="row">
                      <div className="form-group col-sm-6">
                        <input
                          className="form-control"
                          type="tel"
                          name="number"
                          placeholder="Card Number"
                          pattern="[\d| ]{16,22}"
                          onChange={handleInputChange}
                          required
                        />
                        <div className="invalid-feedback">
                          Please fill in the card number!
                        </div>
                      </div>
                      <div className="form-group col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          name="name"
                          maxLength={25}
                          placeholder="Full Name"
                          onChange={handleInputChange}
                          required
                        />
                        <div className="invalid-feedback">
                          Please provide name on the card!
                        </div>
                      </div>
                      <div className="form-group col-sm-3">
                        <input
                          className="form-control"
                          type="tel"
                          name="expiry"
                          placeholder="MM/YY"
                          pattern="\d\d/\d\d"
                          onChange={handleInputChange}
                          required
                        />
                        <div className="invalid-feedback">
                          Please provide card expiration date!
                        </div>
                      </div>
                      <div className="form-group col-sm-3">
                        <input
                          className="form-control"
                          type="text"
                          name="cvc"
                          placeholder="CVC"
                          pattern="\d{3,4}"
                          onChange={handleInputChange}
                          required
                        />
                        <div className="invalid-feedback">
                          Please provide card CVC code!
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <button
                          className="btn btn-primary btn-block mt-0"
                          type="submit"
                          ref={submitCardDetailRef}
                          onClick={addCardDetails}
                        >
                          Register this card
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <form
                    className="needs-validation"
                    method="post"
                    tabIndex={-1}
                    noValidate
                  >
                    <div className="row">
                      <div className="form-group col-sm-6">
                        <input
                          className="form-control"
                          type="text"
                          name="email"
                          placeholder="Email"
                          required
                        />
                        <div className="invalid-feedback">
                          Please fill in the card number!
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <button
                          className="btn btn-primary btn-block mt-0"
                          type="submit"
                        >
                          Register Paypal
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </Portal>
      <section className="col-lg-8">
        {/* Toolbar*/}
        <div className="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 pb-4 pb-lg-5 mb-lg-4">
          <h6 className="font-size-base text-light mb-0">
            Primary payment method is used by default
          </h6>
          {/* <a className="btn btn-primary btn-sm" href="account-signin.html">
            <i className="czi-sign-out mr-2" />
            Sign out
          </a> */}
          <SignOut label="Sign Out" />
        </div>
        {/* Payment methods list*/}
        <div className="table-responsive font-size-md">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Your credit / debit cards</th>
                <th>Name on card</th>
                <th>Expires on</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => {
                return (
                  <tr key={card.id}>
                    <td className="py-3 align-middle">
                      <div className="media align-items-center">
                        <img
                          className="mr-2"
                          src="/img/card-visa.png"
                          width={39}
                          alt="Visa"
                        />
                        <div className="media-body">
                          <span className="font-weight-medium text-heading mr-1">
                            Visa
                          </span>
                          ending in {card.cardNumber.split(" ")[3]}
                          <span className="align-middle badge badge-info ml-2">
                            Primary
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 align-middle">{card.fullName}</td>
                    <td className="py-3 align-middle">{card.validThru}</td>
                    <td className="py-3 align-middle">
                      <button
                        className="nav-link-style mr-2"
                        data-toggle="tooltip"
                        title="Edit"
                        onClick={() => updateCardDetail(card)}
                      >
                        <i className="czi-edit" />
                      </button>
                      {loading.delete ? (
                        <Spinner />
                      ) : (
                        <button
                          className="nav-link-style text-danger"
                          data-toggle="tooltip"
                          title="Remove"
                          onClick={() => deleteCardDetail(card.id)}
                        >
                          <div className="czi-trash" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {/* <tr>
                <td className="py-3 align-middle">
                  <div className="media align-items-center">
                    <img
                      className="mr-2"
                      src="/img/card-master.png"
                      width={39}
                      alt="MesterCard"
                    />
                    <div className="media-body">
                      <span className="font-weight-medium text-heading mr-1">
                        MasterCard
                      </span>
                      ending in 0015
                    </div>
                  </div>
                </td>
                <td className="py-3 align-middle">Susan Gardner</td>
                <td className="py-3 align-middle">11 / 2021</td>
                <td className="py-3 align-middle">
                  <a
                    className="nav-link-style mr-2"
                    href="#"
                    data-toggle="tooltip"
                    title="Edit"
                  >
                    <i className="czi-edit" />
                  </a>
                  <a
                    className="nav-link-style text-danger"
                    href="#"
                    data-toggle="tooltip"
                    title="Remove"
                  >
                    <div className="czi-trash" />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-3 align-middle">
                  <div className="media align-items-center">
                    <img
                      className="mr-2"
                      src="/img/card-paypal.png"
                      width={39}
                      alt="PayPal"
                    />
                    <div className="media-body">
                      <span className="font-weight-medium text-heading mr-1">
                        PayPal
                      </span>
                      s.gardner@example.com
                    </div>
                  </div>
                </td>
                <td className="py-3 align-middle">—</td>
                <td className="py-3 align-middle">—</td>
                <td className="py-3 align-middle">
                  <a
                    className="nav-link-style mr-2"
                    href="#"
                    data-toggle="tooltip"
                    title="Edit"
                  >
                    <i className="czi-edit" />
                  </a>
                  <a
                    className="nav-link-style text-danger"
                    href="#"
                    data-toggle="tooltip"
                    title="Remove"
                  >
                    <div className="czi-trash" />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-3 align-middle">
                  <div className="media align-items-center">
                    <img
                      className="mr-2"
                      src="/img/card-visa.png"
                      width={39}
                      alt="Visa"
                    />
                    <div className="media-body">
                      <span className="font-weight-medium text-heading mr-1">
                        Visa
                      </span>
                      ending in 6073
                    </div>
                  </div>
                </td>
                <td className="py-3 align-middle">Susan Gardner</td>
                <td className="py-3 align-middle">09 / 2021</td>
                <td className="py-3 align-middle">
                  <a
                    className="nav-link-style mr-2"
                    href="#"
                    data-toggle="tooltip"
                    title="Edit"
                  >
                    <i className="czi-edit" />
                  </a>
                  <a
                    className="nav-link-style text-danger"
                    href="#"
                    data-toggle="tooltip"
                    title="Remove"
                  >
                    <div className="czi-trash" />
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-3 align-middle">
                  <div className="media align-items-center">
                    <img
                      className="mr-2"
                      src="/img/card-visa.png"
                      width={39}
                      alt="Visa"
                    />
                    <div className="media-body">
                      <span className="font-weight-medium text-heading mr-1">
                        Visa
                      </span>
                      ending in 9791
                    </div>
                  </div>
                </td>
                <td className="py-3 align-middle">Susan Gardner</td>
                <td className="py-3 align-middle">05 / 2021</td>
                <td className="py-3 align-middle">
                  <a
                    className="nav-link-style mr-2"
                    href="#"
                    data-toggle="tooltip"
                    title="Edit"
                  >
                    <i className="czi-edit" />
                  </a>
                  <a
                    className="nav-link-style text-danger"
                    href="#"
                    data-toggle="tooltip"
                    title="Remove"
                  >
                    <div className="czi-trash" />
                  </a>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
        <hr className="pb-4" />
        {/* {!addresses && (
          <h3>
            <center>No Address Found</center>
          </h3>
        )} */}
        <div className="text-sm-right">
          <a
            className="btn btn-primary"
            href="#add-payment"
            data-toggle="modal"
          >
            Add payment method
          </a>
        </div>
        {/* {loading ? (
          <h3>
            <center>Loading Your Payment Details. . . </center>
          </h3>
        ) : */}
        {cards.length ? (
          <Pagination
            currentPage={currentPage}
            pages={Math.ceil(cards.length / dataLimit)}
            pageLimit={5}
            // dataLimit={10}
            onPageChange={(page) => setCurrentPage(page)}
          />
        ) : (
          <h3>
            <center>No Payment Method to Display</center>
          </h3>
        )}
      </section>
    </>
  );
};

export default withAuth(Payment);
