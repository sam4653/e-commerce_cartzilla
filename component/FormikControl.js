import React from "react";
import Select from "./Select";

function FormikControl(props) {
  const { control, ...rest } = props;

  switch (control) {
    // case 'input':
    //     return <Input { ...rest } />
    // case 'textarea':
    //     return <Textarea { ...rest } />
    case "select":
      return <Select {...rest} />;
    // case 'radio':
    //     return <Radio { ...rest } />
    // case 'checkbox':
    //     return <Checkbox { ...rest } />
    // case 'date':
    //     return <Date { ...rest } />
    default:
      return null;
  }
}

export default FormikControl;
