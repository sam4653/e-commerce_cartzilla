import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { fetchShippingMethod } from "../Redux/Account/accountActions";
import Breadcrumb from "./Breadcrumb";
import CartItem from "./Cart/CartItem";
import withAuth from "./withAuth";
import { getSession } from "next-auth/client";
import axios from "axios";
import Toast from "./Toast";
import { addCheckoutDiscount } from "../Redux/Checkout/checkoutActions";
import { toast } from "react-toastify";
import Spinner from "../component/Spinner";

const convertToDecimal = (value) => {
  // console.log(value)
  return value;
};
const CheckoutHeader = (props) => {
  // console.log("propsS", props);
  const router = useRouter();
  const [data, setData] = useState("");
  const [taxValue, settaxValue] = useState(0);
  //   const taxes = convertToDecimal(+((props.carts.total * data) / 100));

  const discount = convertToDecimal(props.checkout.discount);

  const [promoCode, setPromoCode] = useState(null);
  const [valid, setValid] = useState(true);
  const codeRef = useRef();
  const fee =
    props.carts.carts.length > 0 &&
    convertToDecimal(
      +(props.checkout.shippingMethodId?.fee
        ? props.checkout.shippingMethodId?.fee
        : 0)
    );
  const total = convertToDecimal(
    +props.carts.total + taxValue + +fee - discount
  );
  useEffect(async () => {
    await props.fetchShippingMethod(props.token);
  }, []);

  useEffect( () => {
    let totalTax = 0;
    // const productId = localStorage.getItem("productId");
    // await axios
    //   .get(`${process.env.HOST}/product/${productId}`)
    //   .then((res) => {
    //     setData(res.data.data.tax);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    props.carts.carts?.map((t) => {
      totalTax += convertToDecimal(+((t.total * t.tax) / 100));
      console.log("t.tax",t.tax);
      settaxValue(totalTax);
      localStorage.setItem("Taxv",totalTax && totalTax  )
    });
  }, [props.carts]);


  
  const handlePromoCode = async (e) => {
    e.preventDefault();
    if (!promoCode) {
      setValid(false);
      return;
    }
    setValid(false);
    const sess = await getSession();
    codeRef.current.disabled = true;
    await axios
      .get(
        `${process.env.HOST}/discount/promo/${promoCode}?totalAmount=${props.carts.total}`,
        {
          headers: { Authorization: sess.accessToken },
        }
      )
      .then((res) => {
        toast.info("🎉 " + "Promo Code Applied!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          onClose: () => {
            codeRef.current.disabled = false;
          },
        });
        props.addDiscount({ data: Number(res.data.data) });
        setPromoCode("");
      })
      .catch((err) => {
        setValid(false);
        toast.error("😢 " + err.response?.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          onClose: () => (codeRef.current.disabled = false),
        });
      });
  };

  return (
    <div>
      {/* <div className="page-title-overlap bg-dark pt-4"> */}
      <div className="position-relative bg-dark pt-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
            <Breadcrumb />
          </div>
          <div className="order-lg-1 pr-lg-4 text-center text-lg-left">
            <h1 className="h3 text-light mb-0">Checkout</h1>
          </div>
        </div>
      </div>
      <div className="container pb-5 mb-2 mb-md-4">
        <div className="row">
          <section className="col-lg-8">
            <div className="steps steps-dark pt-5 pb-3 mb-5">
              <Link href="/cart">
                <a
                  className={`step-item ${
                    router.pathname.startsWith("/checkout") ? "active" : ""
                  }`}
                >
                  <div className="step-progress">
                    <span className="step-count">1</span>
                  </div>
                  <div className="step-label">
                    <i className="czi-cart" />
                    Cart
                  </div>
                </a>
              </Link>
              <Link
                href="/checkout/detail"
                className={`${
                  router.pathname === "checkout/detail" ? "current" : ""
                }`}
              >
                <a
                  className={`step-item ${
                    router.pathname === "/checkout/detail"
                      ? "active current"
                      : router.pathname === "/checkout/shipping" ||
                        router.pathname === "/checkout/payment" ||
                        router.pathname === "/checkout/review"
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="step-progress">
                    <span className="step-count">2</span>
                  </div>
                  <div className="step-label">
                    <i className="czi-user-circle" />
                    Your details
                  </div>
                </a>
              </Link>
              <Link
                href="/checkout/shipping"
                className={`${
                  router.pathname === "checkout/shipping" ? "current" : ""
                }`}
              >
                <a
                  className={`step-item ${
                    router.pathname === "/checkout/shipping"
                      ? "active current"
                      : router.pathname === "/checkout/payment" ||
                        router.pathname === "/checkout/review"
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="step-progress">
                    <span className="step-count">3</span>
                  </div>
                  <div className="step-label">
                    <i className="czi-package" />
                    Shipping
                  </div>
                </a>
              </Link>

              {/* <Link
                                href="/checkout/payment"
                                className={`${
                                    router.pathname === "checkout/payment"
                                        ? "current"
                                        : ""
                                }`}
                            >
                                <a
                                    className={`step-item ${
                                        router.pathname === "/checkout/payment"
                                            ? "active current"
                                            : router.pathname ===
                                              "/checkout/review"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <div className="step-progress">
                                        <span className="step-count">4</span>
                                    </div>
                                    <div className="step-label">
                                        <i className="czi-card" />
                                        Payment
                                    </div>
                                </a>
                            </Link> */}
              <Link
                href="/checkout/review"
                className={`${
                  router.pathname === "checkout/review" ? "current" : ""
                }`}
              >
                <a
                  className={`step-item ${
                    router.pathname === "/checkout/review"
                      ? "active current"
                      : ""
                  }`}
                >
                  <div className="step-progress">
                    <span className="step-count">4</span>
                  </div>
                  <div className="step-label">
                    <i className="czi-check-circle" />
                    Review
                  </div>
                </a>
              </Link>
            </div>
            {/* Autor info*/}
            <div className="d-sm-flex justify-content-between align-items-center bg-secondary p-4 rounded-lg mb-grid-gutter">
              <div className="media align-items-center">
                <div
                  className="img-thumbnail rounded-circle position-absolute mt-1"
                  style={{ width: "5.075rem", left: "27px" }}
                >
                  {/* <span
                                        className="badge badge-warning"
                                        data-toggle="tooltip"
                                        title="Reward points"
                                    >
                                        384
                                    </span> */}
                  <img
                    className="rounded-circle"
                    style={{
                      width: "70px",
                      height: "70px",
                    }}
                    src={
                      !(props.user.photo === "null" || props.user.photo === "")
                        ? props.user.photo
                        : "/avtar/avtar.png"
                    }
                    alt="User Photo"
                  />
                </div>
                <div className="media-body" style={{ paddingLeft: "5rem" }}>
                  <h3 className="font-size-base mb-0">
                    {props.user.fullName !== "null null"
                      ? props.user.fullName
                      : "No Name"}
                  </h3>
                  <span className="text-accent font-size-sm">
                    {props.user.email}
                  </span>
                </div>
              </div>

              <Link href="/account/setting">
                <a className="btn btn-light btn-sm btn-shadow mt-5 mt-sm-0">
                  <i className="czi-edit mr-2" />
                  Edit profile
                </a>
              </Link>
            </div>
            {props.children}
          </section>
          {/* Sidebar*/}
          <aside className="col-lg-3 pt-4 pt-lg-0">
            <div className="cz-sidebar-static rounded-lg box-shadow-lg ml-lg-auto">
              <div className="widget mb-3">
                <h2 className="widget-title text-center">Order summary</h2>
                {props.carts.carts.length > 0 ? (
                  props.carts.carts.map((cart) => {
                    return <CartItem key={cart.pId} cart={cart} />;
                  })
                ) : (
                  <center>No Products found.</center>
                )}
              </div>
              <ul className="list-unstyled font-size-sm pb-2 border-bottom">
                <li className="d-flex justify-content-between align-items-center">
                  <span className="mr-2">Subtotal:</span>
                  <span className="text-right">
                    ₹ {convertToDecimal(props.carts.total)}
                  </span>
                </li>
                <li className="d-flex justify-content-between align-items-center">
                  <span className="mr-2">Shipping:</span>
                  {fee ? (
                    <span className="text-right">+ ₹{fee?.toFixed(2)}</span>
                  ) : (
                    <span className="text-right">-</span>
                  )}
                </li>
                <li className="d-flex justify-content-between align-items-center">
                  <span className="mr-2">Taxes:</span>
                  <span className="text-right">
                    + ₹{  taxValue?.toFixed(2) === "NaN" ? "00" : taxValue?.toFixed(2)}
                    {/* {console.log("tax", taxes)} */}
                  </span>
                </li>
                <li className="d-flex justify-content-between align-items-center">
                  <span className="mr-2">Discount:</span>
                  <span className="text-right">- ₹{discount?.toFixed(2)}</span>
                </li>
              </ul>
              <h3 className="font-weight-normal text-center my-4">
                ₹{ total?.toFixed(2)  === "NaN"  ?  "calculating..." :  total?.toFixed(2) }
              </h3>
              <form
                className={`needs-validation ${valid ? "" : "was-validated"}`}
                noValidate
                onSubmit={handlePromoCode}
              >
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Promo code"
                    onChange={(e) => setPromoCode(e.target.value)}
                    onFocus={() => setValid(true)}
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide promo code.
                  </div>
                </div>
                <button
                  className="btn btn-outline-primary btn-block"
                  type="submit"
                  ref={codeRef}
                >
                  Apply promo code
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    carts: state.carts,
    user: state.user.user,
    checkout: state.checkout,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchShippingMethod: (token) => dispatch(fetchShippingMethod(token)),
    addDiscount: (data) => dispatch(addCheckoutDiscount(data)),
  };
};

export default withAuth(
  connect(mapStateToProps, mapDispatchToProps)(CheckoutHeader)
);
