import React from "react";
import { Field, ErrorMessage } from "formik";

function Select(props) {
  const { label, name, options, ...rest } = props;
  return (
    <div className="col-sm-6">
      <div className="form-group">
        <label htmlFor="checkout-country">{label}</label>
        <Field as="select" id={name} name={name} {...rest}>
          <option key="">Choose {name}</option>
          {options.map((option) => {
            return (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            );
          })}
        </Field>
        <ErrorMessage name={name} />
      </div>
    </div>
  );
}

export default Select;
