import React, { useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

const Detail = (props) => {
  const router = useRouter();
  let { countryList } = props;
  if (countryList === undefined) countryList = [{ name: "India", code: "IN" }];

  const [stateList, setStateList] = useState();
  const [cityList, setCityList] = useState();
  const [country, setCountry] = useState();
  const [state, setState] = useState();

  const addCheckoutDetail = useRef(null);

  const emailRegex = new RegExp(
    "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$"
  );

  const phoneRegex = new RegExp("(^[6789][0-9]{9})+$");

  const zipCodeRegex = new RegExp("^[0-9]{6}$");

  const spaceValidation = new RegExp(
    "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
  );

  const checkoutDetailSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .required("FirstName Is Required!"),
    lastName: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .required("LastName Is Required!"),
    email: Yup.string()
      .matches(emailRegex, "Please, Enter a Valid Email Address!")
      .required("Email Is Required!"),
    phone: Yup.string()
      .matches(phoneRegex, "Please, Enter a Valid Phone Number!")
      .required("Phone Number Is Required!"),
    country: Yup.string().required("Please, Select Country "),
    state: Yup.string().required("Please, Select State"),
    city: Yup.string().required("Please, Select City"),
    address1: Yup.string().required("Please, Enter Your Address"),
    zipCode: Yup.string()
      .matches(zipCodeRegex, "Please, Enter a Valid 6 Digit ZipCode!")
      .required("ZipCode Is Required!"),
  });

  const countryHandleChange = async (e) => {
    const selectedCountry = e.target.value;

    const countryName = e.target.options[e.target.selectedIndex].text;

    setCountry(countryName);

    await axios
      .get(
        `https://country-states-city.herokuapp.com/api/states/${selectedCountry}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setStateList(response.data.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
    // console.log(state);
  };

  const stateHandleChange = async (e) => {
    const selectedState = e.target.value;
    // var index = e.nativeEvent.target.selectedIndex;
    const stateName = e.target.options[e.target.selectedIndex].text;

    setState(stateName);

    // console.log(e.target.value);
    await axios
      .get(
        `https://country-states-city.herokuapp.com/api/city/${selectedState}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setCityList(response.data.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
    // console.log(state);
  };

  // setState((prev) => stateName);
  // };

  const onSubmit = (values) => {
    values.country = country;
    values.state = state;
    // console.log("Form Data :", values);
    router.push("/checkout/shipping");
  };

  return (
    <>
      {/* Shipping address*/}
      <Formik
        enableReinitialize={true}
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "",
          state: "",
          city: "",
          zipCode: "",
          address1: "",
          address2: "",
          isSameAsShippingAddress: true,
        }}
        validationSchema={checkoutDetailSchema}
        onSubmit={onSubmit}
      >
        {({ touched, errors, isValid, handleChange }) => (
          <Form>
            <h2 className="h6 pt-1 pb-3 mb-3 border-bottom">
              Shipping address
            </h2>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="checkout-fn">First Name</label>
                  <Field
                    className={`form-control ${touched.firstName && errors.firstName ? "is-invalid" : ""
                      }`}
                    type="text"
                    id="checkout-fn"
                    name="firstName"
                  />
                  <ErrorMessage
                    component="div"
                    name="firstName"
                    className="invalid-feedback"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="checkout-ln">Last Name</label>
                  <Field
                    className={`form-control ${touched.lastName && errors.lastName ? "is-invalid" : ""
                      }`}
                    type="text"
                    id="checkout-ln"
                    name="lastName"
                  />
                  <ErrorMessage
                    component="div"
                    name="lastName"
                    className="invalid-feedback"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="checkout-email">E-mail Address</label>
                  <Field
                    className={`form-control ${touched.email && errors.email ? "is-invalid" : ""
                      }`}
                    type="email"
                    id="checkout-email"
                    name="email"
                  />
                  <ErrorMessage
                    component="div"
                    name="email"
                    className="invalid-feedback"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="checkout-phone">Phone Number</label>
                  <Field
                    className={`form-control ${touched.phone && errors.phone ? "is-invalid" : ""
                      }`}
                    type="text"
                    id="checkout-phone"
                    name="phone"
                  />
                  <ErrorMessage
                    component="div"
                    name="phone"
                    className="invalid-feedback"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="checkout-company">Company</label>
            <input className="form-control" type="text" id="checkout-company" />
          </div>
        </div> */}
              <div className="col-sm-6">
                <div className="form-group">
                  {/* <FormikControl
                className="form-control custom-select"
                control="select"
                label="Country"
                name="country"
                options={countryList}
              /> */}
                  <label htmlFor="checkout-country">Country</label>
                  <Field
                    as="select"
                    className={`form-control custom-select ${touched.country && errors.country ? "is-invalid" : ""
                      }`}
                    id="checkout-country"
                    name="country"
                    // onChange={countryHandleChange}
                    onBlur={countryHandleChange}
                  >
                    <ErrorMessage
                      component="div"
                      name="country"
                      className="invalid-feedback"
                    />
                    <option key="country" selected="true" disabled="true">
                      ---------------- Choose country ----------------
                    </option>
                    {countryList &&
                      countryList.map((c) => (
                        <option value={c.code} key={c.code}>
                          {c.name}
                        </option>
                      ))}

                    {/* // <option>Canada</option>
              // <option>France</option>
              // <option>Germany</option>
              // <option>Switzerland</option>
              // <option>USA</option>  */}
                  </Field>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="checkout-city">State</label>
                  <Field
                    as="select"
                    className={`form-control custom-select ${touched.state && errors.state ? "is-invalid" : ""
                      }`}
                    id="checkout-state"
                    name="state"
                    // onChange={stateHandleChange}
                    onBlur={stateHandleChange}
                  >
                    <option key="state" selected="true" disabled="true">
                      ------------------ Choose State ------------------
                    </option>
                    {stateList &&
                      stateList.map((s) => (
                        <option value={s.key} key={s.key}>
                          {s.name}
                        </option>
                      ))}
                    {/*               
              <option>Canada</option>
              <option>France</option>
              <option>Germany</option>
              <option>Switzerland</option>
              <option>USA</option> */}
                  </Field>
                  <ErrorMessage
                    component="div"
                    name="state"
                    className="invalid-feedback"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="checkout-city">City</label>
                  <Field
                    as="select"
                    className={`form-control custom-select ${touched.city && errors.city ? "is-invalid" : ""
                      }`}
                    id="checkout-city"
                    name="city"
                  // onChange={cityHandleChange}
                  // onBlur={(e) => blurHandler(e)}
                  >
                    <option key="city" selected="true" disabled="true">
                      ------------------ Choose city ------------------
                    </option>
                    {cityList &&
                      cityList.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    {/* <option>Berlin</option>
              <option>Geneve</option>
              <option>New York</option>
              <option>Paris</option> */}
                  </Field>
                  <ErrorMessage
                    component="div"
                    name="city"
                    className="invalid-feedback"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="checkout-zip">ZIP Code</label>
                  <Field
                    className={`form-control custom-select ${touched.city && errors.city ? "is-invalid" : ""
                      }`}
                    type="text"
                    id="checkout-zip"
                    name="zipCode"
                  />
                  <ErrorMessage
                    component="div"
                    name="zipCode"
                    className="invalid-feedback"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="checkout-address-1">Address 1</label>
                  <Field
                    className={`form-control custom-select ${touched.city && errors.city ? "is-invalid" : ""
                      }`}
                    type="text"
                    id="checkout-address-1"
                    name="address1"
                  />
                  <ErrorMessage
                    component="div"
                    name="address1"
                    className="invalid-feedback"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="checkout-address-2">Address 2</label>
                  <Field
                    className="form-control"
                    type="text"
                    id="checkout-address-2"
                    name="address2"
                  />
                  <ErrorMessage
                    component="div"
                    name="address2"
                    className="invalid-feedback"
                  />
                </div>
              </div>
            </div>
            <h6 className="mb-3 py-3 border-bottom">Billing address</h6>
            <div className="custom-control custom-checkbox">
              <Field
                className="custom-control-input"
                type="checkbox"
                // defaultChecked
                id="same-address"
                name="isSameAsShippingAddress"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
              <label className="custom-control-label" htmlFor="same-address">
                Same as shipping address
              </label>
            </div>
            {/* Navigation (desktop)*/}
            <div className="d-none d-lg-flex pt-4 mt-3">
              <div className="w-50 pr-3">
                <Link href="/cart">
                  <a
                    className="btn btn-secondary btn-block"
                    href="/cart"
                  >
                    <i className="czi-arrow-left mt-sm-0 mr-1" />
                    <span className="d-none d-sm-inline">Back to Cart</span>
                    <span className="d-inline d-sm-none">Back</span>
                  </a>
                </Link>
              </div>
              <div className="w-50 pl-2">
                {/* <Link href="/checkout/shipping"> */}
                <button
                  // className="btn btn-primary btn-block"
                  type="submit"
                  style={{ width: "100%" }}
                  disabled={!isValid}
                  ref={addCheckoutDetail}
                >
                  <a
                    className="btn btn-primary btn-block"
                  // href="checkout-shipping.html"
                  >
                    <span className="d-none d-sm-inline">
                      Proceed to Shipping
                    </span>

                    <span className="d-inline d-sm-none">Next</span>
                    <i className="czi-arrow-right mt-sm-0 ml-1" />
                  </a>
                </button>

                {/* </Link> */}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

// export async function getStaticProps() {
//   let data;
//   await axios
//     .get("https://country-states-city.herokuapp.com/api/country", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//     .then((response) => {
//       data = response.data.data;
//     })
//     .catch((err) => {
//       console.log(err.response.data);
//     });

//   // console.log(data);

//   return {
//     props: {
//       countryList: data || null,
//     },
//   };
// }

export default Detail;
