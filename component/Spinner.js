import React from "react";
import ReactLoading from "react-loading";

const Spinner = () => {
    // const [isLoading, setIsLoading] = useState(false);
  return (
    <>
     
     <span
          className="spinner-border spinner-border-sm ml-1"
          role="status"
          aria-hidden="true"
        ></span>
    </>
  );
};

export default Spinner;
