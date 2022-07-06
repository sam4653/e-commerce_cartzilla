import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addCart } from "../Redux/Cart/cartActions";
import { addWishlist, removeWishlist } from "../Redux/Wishlist/wishListActions";
import { useRouter } from "next/router";
import Toast from "./Toast";
import { getSession } from "next-auth/client";
import {
    reset_Product,
    set_quickViewProduct,
} from "../Redux/Account/accountActions";
import Portal from "./Portal";
import Filter from "./Filter";
import Breadcrumb from "./Breadcrumb";
import QuickView from "./QuickView";
import ShopProductGrid from "./ShopProductGrid";
import Banner from "./Banner";
import styles from "../styles/Rutvik.module.css";
import ShopProductList from "./ShopProductList";
import Spinner from "./Spinner";
const dataLimit = 20;

const Category = (props) => {
    const router = useRouter();

    // const urlLength = router.asPath.split("/").length;
    // console.log("length : ", urlLength, router);
    // const { index } = router.query;
    // const categoryName = urlLength == 3 ? index : router.asPath.split("/")[1];
    const type = router.asPath.split("/").pop();
    const [loading, setLoading] = useState(true)
    const { brandName } = props;
    const [colorname, setColorname] = useState("");
    const [select, setSelect] = useState("");
    const [hide, setHide] = useState(false);
    const categorysuperName = router.asPath.split("/")[4];
    const categoryName = router.asPath.split("/")[3];
    const mainCategory = router.asPath.split("/")[2];
    //   alert("mainCategory",mainCategory)
    let newsub = categorysuperName?.split("_")?.join(" ");
    let newcategoryName = categoryName?.replace('And', ' %26 ').split("_")?.join(" ");

    // console.log("categorysuperName",categorysuperName);
    const handleChange = (e) => {
        // alert(e.target.value)
        setColorname(e.target.value);
    }
    const handleselect = (e) => {
        setSelect(e.target.value);
    }

    // console.log("mainCategory",mainCategory);

    const [advertisements, setAdvertisements] = useState();

    const { searchProducts } = props.searchProducts;

    let page = parseInt(router.query.page) || 1;
    const clicklink = useRef();
    const { quickViewProduct } = props.quickViewProduct;
    const [sessionUser, setSessionUser] = useState(null);
    const [view, setView] = useState(true);
    const [brand, setBrand] = useState([]);
    const [size, setSize] = useState([]);
    const [color, setColor] = useState([]);
    const [range, setRange] = useState({ min: 0, max: 2000 });

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(async () => {
        const getAdvertisement = async () => {
            try {
                const res = await axios.get(
                    `${process.env.HOST}/advertisements`
                );
                setAdvertisements(res.data.data);
            } catch (err) {
                console.log(err.response);
            }
        };
        getAdvertisement();
    }, []);

    const getFilter = async (brandName, colorName, sizeType, cat) => {
        try {
            const res = await axios.get(
                brandName.length > 0 ||
                    colorName.length > 0 ||
                    sizeType.length > 0
                    ? `${process.env.HOST}/products/filter?brand=${brandName}&color=${colorName}&size=${sizeType}&cat=${cat}`
                    : `${process.env.HOST}/products`
            );
            setData(res.data.data);
            setLoading(false)
        } catch (err) {
            Toast("No More Products!");
            // router.push("/productNotFound");
        }
    };
    useEffect(() => {
        // if (brand.length > 0 && color.length > 0 && size.length > 0) {
        //   setFilteredData((fd) => fd.color.includes(color));
        // } else if (brand.length > 0 && color.length > 0) {
        //   setFilteredData((fd) => fd.color.includes(color));
        // } else if (brand.length > 0 && size.length > 0) {
        //   setFilteredData((fd) => fd.color.includes(color));
        // } else if (color.length > 0 && size.length > 0) {
        //   setFilteredData((fd) => fd.color.includes(color));
        // } else if (brand.length > 0) {
        //   setFilteredData((fd) => fd.color.includes(color));
        // } else if (color.length > 0) {
        //   setFilteredData(setData.filter((fd) => fd.color.includes(color)));
        // } else if (size.length > 0) {
        //   setFilteredData((fd) => fd.color.includes(color));
        // }
        if (color.length > 0) {
            // setFilteredData(data.filter((fd) => fd.color.includes(color)));
            // console.log(data.filter((fd) => fd.color.includes(color)));
            setFilteredData(
                data.filter(({ color: id1 }) =>
                    color?.split(",")?.some((c) => c === id1)
                )
            );
        }
        // router.isReady && console.log(router.asPath);
    }, [brand, color, size]);

    useEffect(async () => {
        if (searchProducts.length) {
            // console.log("NEw");
            setData(searchProducts);
            setLoading(false);
            props.resetSearchProducts();
            page = 1;
        }
    }, [searchProducts]);

    useEffect(async () => {
        if (!searchProducts.length && router.isReady) {
            if (
                type == "Men" ||
                type == "Women" ||
                type == "Kids" ||
                type == "Beauty" ||
                type == "Shoes&Bags" ||
                brandName
            ) {
                (type || brandName) &&
                    (await axios
                        .get(
                            `${process.env.HOST}/products?${brandName
                                ? "brand=" + brandName
                                : "categoryName=" + type
                            }`
                        )
                        .then((res) => {
                            // console.log(res.data.data);
                            setData(res.data.data);
                            setLoading(false);
                        })
                        .catch((err) => {
                            Toast("No More Products!");
                            // if (!data.length) router.push("/productNotFound");
                            router.push(`/shop?page=${(page = page - 1)}`);
                            // console.log(err.response?.data);
                            setLoading(false);
                        }));
            } else {
                categoryName && categorysuperName && newsub ?
                    (await axios
                        .get(
                            `${process.env.HOST}/products?categoryName=${mainCategory.replace('And', ' %26 ')}&scName=${categoryName.replace('&', '%26')}&sscName=${newsub.replace('And', ' %26 ')}`
                        )
                        .then((res) => {
                            // console.log("res", res.data.data);
                            setData(res.data.data);
                            setLoading(false)
                            // alert("ssc")
                        })
                        .catch((err) => {
                            Toast("No More Products!");
                            router.push(`/shop?page=${(page = page - 1)}`);
                            // console.log(err?.response?.data?.message);
                            setLoading(false);
                            // if (!data.length) router.push("/productNotFound");
                        })

                    )
                    :
                    (await axios
                        .get(
                            `${process.env.HOST}/products?categoryName=${mainCategory.replace('And', ' %26 ')}&scName=${newcategoryName ? newcategoryName : " "}`
                        )
                        .then((res) => {
                            // console.log("res",res.data.data);
                            setData(res.data.data);
                            setLoading(false);

                            // alert("sc")

                        })
                        .catch((err) => {
                            Toast("No More Products!");
                            router.push(`/shop?page=${(page = page - 1)}`);
                            // console.log(err?.response?.data?.message);
                            setLoading(false);
                            // if (!data.length) router.push("/productNotFound");
                        }))


            }
            //   }
        }
    }, [router.isReady, categoryName, brand, type, mainCategory]);

    const getsess = async () => {
        const sess = await getSession();
        // console.log("session",sess);
        setSessionUser(sess?.user?.role);
    }
    const addNewCart = (pId,name,photos,sellingPrice,attributes,quantity) => {


        if (props.user.token) {
            props.addCart({ cart: {pId,name,photos,sellingPrice,attributes,quantity} ,  token: props.user.token });
        } else {
            // toast.error("😊 " + "Please enter your login details", {
            //     position: toast.POSITION.TOP_RIGHT,
            //     autoClose: 1000,
            //     transition: Flip,
            // });
        }
    };
    useEffect(() => {
        getsess();
    }, [])

    const addWishlist = (e, product) => {
        const { checked } = e.target;
        if (props.user.token) {
            if (checked) {
                props.addWishlist({ token: props.user.token, product: product });
            } else {
                props.removeWishlist({ token: props.user.token, pid: product.id });
            }
        } else {
            // toast.error("😊 " + "Please enter your login details", {
            //     position: toast.POSITION.TOP_RIGHT,
            //     autoClose: 1000,
            //     transition: Flip,
            // });
            clicklink.current.click();
        }
    };

    const getPaginationGroup = () => {
        let start = Math.floor((page - 1) / 5) * 5;
        return new Array(5).fill().map((_, idx) => start + idx + 1);
    };

    const handleHide = (e) => {
        if (e.target.id === "page-clicked") {
            setHide(false)
        }
        else {
            setHide(true);
        }
    }

    return (
        <div id="page-clicked" onClick={(e) => { handleHide(e) }}>
            <Portal>
                <div
                    className="modal-quick-view modal fade"
                    id="quick-view"
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title product-title">
                                    {/* <Link href={`/product/${quickViewProduct.productName}`}> */}
                                    <a
                                        data-toggle="tooltip"
                                        data-placement="right"
                                        title="Go to product page"
                                        href={`/single/${quickViewProduct.productName}?id=${quickViewProduct.id}`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {quickViewProduct &&
                                            quickViewProduct.productName}
                                        <i className="czi-arrow-right font-size-lg ml-2"></i>
                                    </a>
                                    {/* </Link> */}
                                </h4>
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
                                {/* Quick View Product */}
                                {quickViewProduct && (
                                    <QuickView product={quickViewProduct} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Portal>
            <div className="pt-4 pb-5  bg-dark">
                <div className="container pt-2 pb-5 pt-lg-3 pb-lg-5">
                    <Breadcrumb />
                </div>
            </div>
            {/* Page Content*/}
            <div className="container pb-5 mb-2 mb-md-4">
                {/* Toolbar*/}
                <div className="bg-light box-shadow-lg rounded-lg p-4 mt-n5 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="dropdown mr-2">
                            <a
                                className="btn btn-outline-secondary dropdown-toggle"
                                href="#shop-filters"
                                data-toggle="collapse"
                            >
                                <i className="czi-filter mr-2" />
                                Filters
                            </a>
                        </div>
                        {/* <div className="d-flex">
                            <Link
                                href={`/shop?page=${
                                    page === 1 ? page : +page - 1
                                }`}
                                disabled={page === 1}
                            >
                                <a className="nav-link-style mr-3" href="#">
                                    <i className="czi-arrow-left" />
                                </a>
                            </Link>
                            <span className="font-size-md">
                                {page} / {getPaginationGroup().pop()}
                            </span>
                            <Link
                                href={`/shop?page=${
                                    data.length < 20 ? page : page + 1
                                }`}
                                disabled={data.length < 20 ? true : false}
                            >
                                <a className="nav-link-style ml-3">
                                    <i className="czi-arrow-right" />
                                </a>
                            </Link>
                        </div> */}
                        <div className="d-none d-sm-flex">
                            <a
                                className={`btn btn-icon nav-link-style ${view
                                    ? "bg-primary text-light disabled opacity-100 mr-2"
                                    : ""
                                    }`}
                                onClick={() => { setView(!view); }}
                            // href="#"
                            >
                                <i className="czi-view-grid" />
                            </a>
                            <a
                                className={`btn btn-icon nav-link-style ${!view
                                    ? "bg-primary text-light disabled opacity-100 mr-2"
                                    : ""
                                    }`}
                                // href="shop-list-ft.html"
                                onClick={() => setView(!view)}
                            >
                                <i className="czi-view-list" />
                            </a>
                        </div>
                    </div>
                    {/* Toolbar with expandable filters*/}
                    <div>
                        {
                            hide && <Filter
                                setRange={setRange}
                                range={range}
                                setBrand={setBrand}
                                brand={brand}
                                size={size}
                                getFilter={getFilter}
                                setSize={setSize}
                                color={color}
                                setColor={setColor}
                            />
                        }

                    </div>
                </div>
                {/* Products*/}

                {
                    loading ?
                        <>
                            <Spinner />
                        </>
                        :
                        <>
                            {view ? (
                                <div className="row mx-n2">
                                    {(filteredData?.length > 0 ? filteredData : data)
                                        .slice(0, 8)
                                        .map((product) => {
                                            return (
                                                <>
                                                    {/* Products grid*/}
                                                    <ShopProductGrid
                                                        product={product}
                                                        token={props.user.token}
                                                        wishlists={
                                                            props.wishlists.wishlists
                                                        }
                                                        handleChange={handleChange}
                                                        handleselect={handleselect}
                                                        clicklink={clicklink}
                                                        addWishlist={addWishlist}
                                                        addNewCart={addNewCart}
                                                        loading={props.carts.loading}
                                                        key={product.id}
                                                    />
                                                    <hr className="my-3" />
                                                </>
                                            );
                                        })}
                                </div>
                            ) : (
                                (filteredData?.length > 0 ? filteredData : data)
                                    .slice(0, 8)
                                    .map((product) => {
                                        return (
                                            <>
                                                <ShopProductList
                                                    product={product}
                                                    token={props.user.token}
                                                    handleChange={handleChange}
                                                    handleselect={handleselect}
                                                    wishlists={props.wishlists.wishlists}
                                                    addWishlist={addWishlist}
                                                    addNewCart={addNewCart}
                                                    loading={props.carts.loading}
                                                    key={product.id}
                                                />
                                                <hr className="my-3" />
                                            </>
                                        );
                                    })
                            )}
                        </>

                }

                {/* Banners*/}
                {data.length > 8 && advertisements && (
                    <Banner advertisements={advertisements} />
                )}

                {/* Products grid*/}
                {/* Product*/}
                {view ? (
                    <div className="row mx-n2">
                        {(filteredData?.length > 0 ? filteredData : data)
                            .slice(8, 20)
                            .map((product) => {
                                return (
                                    <>
                                        <ShopProductGrid
                                            product={product}
                                            token={props.user.token}
                                            wishlists={
                                                props.wishlists.wishlists
                                            }
                                            addWishlist={addWishlist}
                                            addNewCart={addNewCart}
                                            loading={props.carts.loading}
                                            key={product.id}
                                        />
                                        <hr className="my-3" />
                                    </>
                                );
                            })}
                    </div>
                ) : (
                    (filteredData?.length > 0 ? filteredData : data)
                        .slice(8, 20)
                        .map((product) => {
                            return (
                                <>
                                    <ShopProductList
                                        product={product}
                                        token={props.user.token}
                                        wishlists={props.wishlists.wishlists}
                                        addWishlist={addWishlist}
                                        addNewCart={addNewCart}
                                        loading={props.carts.loading}
                                        key={product.id}
                                    />
                                    <hr className="my-3" />
                                </>
                            );
                        })
                )}

                {/* Pagination*/}
                {/* <nav
                    className="d-flex justify-content-between pt-2"
                    aria-label="Page navigation"
                >
                    <ul className="pagination"> */}
                {/* <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1 ? true : false}
            > */}
                {/* <li className={`page-item ${page === 1 ? "disabled" : ""}`} >
                            <Link href={`/shop?page=${page === 1 ? page : +page - 1 }`} disabled={page === 1}>
                                <a className="page-link">
                                    <i className="czi-arrow-left mr-2" />
                                    Prev
                                </a>
                            </Link>
                        </li> */}
                {/* </button> */}
                {/* </ul>
                    <ul className="pagination">
                        <li className="page-item d-sm-none">
                            <span className="page-link page-link-static">
                                {page} / {getPaginationGroup.length}
                            </span>
                        </li>
                        {getPaginationGroup().map((item, index) => {
                            return (
                                //  <button onClick={() => setCurrentPage(item)} key={index}>
                                <li className={`page-item d-none d-sm-block ${page == item ? "active" : ""
                                    } ${(data.length < 20) & (item > page)
                                        ? "disabled"
                                        : ""
                                    }`}
                                    key={index}
                                // style={{ pointerEvents: "none"}}
                                >
                                    <Link href={`/shop?page=${item}`}
                                        disabled={
                                            (data.length < 20) & (item > page)
                                                ? true
                                                : false
                                        } >
                                        <a className="page-link">{item}</a>
                                    </Link>
                                </li> */}
                {/* // </button> */}
                {/* );
                        })}
                    </ul>
                    <ul className="pagination"> */}
                {/* <button
              onClick={goToNextPage}
              disabled={data.length < 20 ? true : false}
            > */}
                {/* <li className={`page-item ${data.length < 20 ? "disabled" : ""}`}
                            style={{
                                pointerEvents: `${data.length < 20 ? "none" : ""
                                    }`,
                            }}
                        >
                            <Link href={`/shop?page=${data.length < 20 ? page : page + 1}`}
                                disabled={data.length < 20 ? true : false}
                            >
                                <a className="page-link" aria-label="Next">
                                    Next
                                    <i className="czi-arrow-right ml-2" />
                                </a>
                            </Link>
                        </li> */}
                {/* </button> */}
                {/* </ul>
                </nav> */}
            </div>
            {/* Toast: Added to Cart*/}
            <div className="toast-container toast-bottom-center">
                <div className="toast mb-3" id="cart-toast" data-delay={5000} role="alert" aria-live="assertive" aria-atomic="true" >
                    <div className="toast-header bg-success text-white">
                        <i className="czi-check-circle mr-2" />
                        <h6 className="font-size-sm text-white mb-0 mr-auto">
                            Added to cart!
                        </h6>
                        <button
                            className="close text-white ml-2 mb-1"
                            type="button"
                            data-dismiss="toast"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="toast-body">
                        This item has been added to your cart.
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        carts: state.carts,
        wishlists: state.wishlists,
        user: state.user,
        quickViewProduct: state.quickViewProduct,
        searchProducts: state.searchProducts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addCart: (cart) => dispatch(addCart(cart)),
        addWishlist: (data) => dispatch(addWishlist(data)),
        removeWishlist: (data) => dispatch(removeWishlist(data)),
        setQuickViewProduct: (product) =>
            dispatch(set_quickViewProduct(product)),
        resetSearchProducts: () => dispatch(reset_Product()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
