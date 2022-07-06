import React from "react";
import { signOut } from "next-auth/client";
import { remove_user_detail } from "../Redux/User/userActions";
import { reset_cart } from "../Redux/Cart/cartActions";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import {
  reset_address,
  reset_order,
  reset_ticket,
} from "../Redux/Account/accountActions";
import { reset_wishlist } from "../Redux/Wishlist/wishListActions";
const SignOut = ({
  removeUserDetail,
  resetCart,
  resetOrder,
  resetWishlist,
  resetTicket,
  resetAddress,
  type,
  label,
}) => {
  const router = useRouter();
  const logout = async () => {
    await signOut({ redirect: false });
    // await router.replace("/");
    if (router.pathname !== "/") {
      await router.replace("/");
    }
    removeUserDetail();
    resetCart();
    resetOrder();
    resetWishlist();
    resetAddress();
    resetTicket();
  };

  return type != "link" ? (
    <button
      className="nav-link-style d-flex align-items-center px-4 py-3"
      onClick={logout}
    >
      {type === "label" ? (
        <>
          <i className="czi-sign-out opacity-60 mr-2" /> {label}
        </>
      ) : (
        <a className="btn btn-primary btn-sm">
          <i className="czi-sign-out mr-2" />
          {label}
        </a>
      )}
    </button>
  ) : (
    <button className="dropdown-item" onClick={logout}>
      {label}
    </button>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeUserDetail: () => dispatch(remove_user_detail()),
    resetCart: () => dispatch(reset_cart()),
    resetOrder: () => dispatch(reset_order()),
    resetWishlist: () => dispatch(reset_wishlist()),
    resetTicket: () => dispatch(reset_ticket()),
    resetAddress: () => dispatch(reset_address()),
  };
};

export default connect(null, mapDispatchToProps)(SignOut);
