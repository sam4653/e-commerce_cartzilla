import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
const AddressModal = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);
  return mounted
    ? ReactDOM.createPortal(
      <form
        className="needs-validation modal fade"
        method="post"
        id="add-address"
        tabIndex="-1"
        noValidate
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add a new address</h5>
              <button
                className="close"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="address-fn">First name</label>
                    <input
                      className="form-control"
                      type="text"
                      id="address-fn"
                      required
                    />
                    <div className="invalid-feedback">
                      Please fill in you first name!
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="address-ln">Last name</label>
                    <input
                      className="form-control"
                      type="text"
                      id="address-ln"
                      required
                    />
                    <div className="invalid-feedback">
                      Please fill in you last name!
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="address-company">Company</label>
                    <input
                      className="form-control"
                      type="text"
                      id="address-company"
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="address-country">Country</label>
                    <select
                      className="custom-select"
                      id="address-country"
                      required
                    >
                      <option value>Select country</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Belgium">Belgium</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Spain">Spain</option>
                      <option value="UK">United Kingdom</option>
                      <option value="USA">USA</option>
                    </select>
                    <div className="invalid-feedback">
                      Please select your country!
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="address-city">City</label>
                    <input
                      className="form-control"
                      type="text"
                      id="address-city"
                      required
                    />
                    <div className="invalid-feedback">
                      Please fill in your city!
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="address-line1">Line 1</label>
                    <input
                      className="form-control"
                      type="text"
                      id="address-line1"
                      required
                    />
                    <div className="invalid-feedback">
                      Please fill in your address!
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="address-line2">Line 2</label>
                    <input
                      className="form-control"
                      type="text"
                      id="address-line2"
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="address-zip">ZIP code</label>
                    <input
                      className="form-control"
                      type="text"
                      id="address-zip"
                      required
                    />
                    <div className="invalid-feedback">
                      Please add your ZIP code!
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="custom-control custom-checkbox">
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      id="address-primary"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="address-primary"
                    >
                      Make this address primary
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                data-dismiss="modal"
              >
                Close
              </button>
              <button className="btn btn-primary btn-shadow" type="submit">
                Add address
              </button>
            </div>
          </div>
        </div>
      </form>,
      document.querySelector("#modalRoot")
    )
    : null;
};

export default AddressModal;
