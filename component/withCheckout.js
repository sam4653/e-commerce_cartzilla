import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Spinner from "../component/Spinner";
import { connect } from "react-redux";

const withCheckout = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const { carts } = props.carts;

    useEffect(() => {
      let path;
      if (router.pathname.startsWith("/checkout/")) {
        path = "/cart";
      }
      const securePage = async () => {
        // console.log("in Wrapper : ", carts);

        if (!carts.length) {
          router.push({
            pathname: path,
            query: { callback: router.pathname },
            shallow: true,
          });
        }
        setLoading(false);
      };
      securePage();
    }, []);

    // return <WrappedComponent {...props} token={token} user={user} />;
    if (loading) {
      return (
        <h1>
          <Spinner />
        </h1>
      );
    } else {
      return <WrappedComponent {...props} />;
    }
  };
};

export default withCheckout;
