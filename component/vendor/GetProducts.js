import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Spinner from "../Spinner";
import { removeProduct } from "../../Redux/Product/productAction";
import { useRouter } from "next/router";
import Link from "next/link";


const GetProducts = ({
    product,
    productLoading,
    token,
    removeProduct,
    page,
    key,
    setId
}) => {

    const router = useRouter();

    // console.log("page Number:::",page)
    // console.log("prodcut id:::", produc  t.id)


    return (
        <div key={key}>
            <div className="media d-block d-sm-flex align-items-center py-4 border-bottom">
                <a className="d-block position-relative mb-3 mb-sm-0 mr-sm-4 mx-auto">
                    <img
                        className="rounded-lg"
                        style={{ height: "150px", width: "150px" }}
                        src={product.photos[0]}
                        alt="Product"
                    />
                </a>
                <div className="media-body text-center text-sm-left">
                    <h3 className="h6 product-title mb-2">
                        <a
                            href={`/single/${product.productName}?id=${product.id}`}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {product.productName}
                        </a>
                    </h3>
                    <div className="d-inline-block text-accent">
                        MRP : Rs {Number(product.MRP).toFixed(2)}
                    </div>
                    <div className="d-inline-block text-accent border-left ml-2 pl-2 ">
                        Selling Price : Rs {Number(product.sellingPrice).toFixed(2)}
                    </div>
                    <a
                        className={`d-inline-block text-accent font-size-ms border-left ml-2 pl-2`}
                        href={`/shop/brand/${product.brand}`}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        by : {product.brand}
                    </a>
                    <span
                        className={`d-inline-block  font-size-ms border-left ml-2 pl-2 ${product.status !== "Active"
                            ? "text-danger"
                            : "text-accent"
                            }`}
                        href="#"
                    >
                        {product.status}
                    </span>
                    <div className="form-inline pt-2">
                        <div className="d-flex justify-content-center justify-content-sm-start pt-3">
                            <button
                                className="btn bg-faded-info btn-icon mr-2"
                                type="button"
                                data-toggle="tooltip"
                                title="Edit"
                                onClick={() => {
                                    localStorage.setItem("productId", product.id);
                                    localStorage.setItem("pageNo", page)
                                    router.push("/vendor/productEdit");
                                }}
                            >
                                <i className="czi-edit text-info"></i>
                            </button>
                            <button
                                className="btn bg-faded-danger btn-icon"
                                type="submit"
                                name="archive"
                                href="#myModal"
                                data-toggle="modal"
                                // data-toggle="tooltip"
                                title="Delete"
                                onClick={() => setId(product.id)}
                            // onClick={() => {
                            //     removeProduct({
                            //         token: token,
                            //         id: product.id,
                            //     });
                            //     setId(product.id);
                            // }}
                            >
                                {/* {productLoading && id === product.id ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <i className="czi-trash text-danger"></i>
                                        </>
                                    )} */}
                                <i className="czi-trash text-danger"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete modal start */}
            {/* <div id="myModal" className="modal fade">
                <div className="modal-dialog modal-confirm modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header flex-column">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <div className="icon-box">
                                <i className="czi-trash h2 text-danger"></i>
                            </div>
                        </div>
                        <div className="modal-body text-center">
                            <p>Do you really want to delete these Product?</p>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => {
                                console.log(id)
                                removeProduct({
                                    token: token,
                                    id: id,
                                });
                            }}>Delete</button>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        productLoading: state.products.loading,
    };
};

export default connect(mapStateToProps)(GetProducts);
