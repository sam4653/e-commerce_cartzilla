import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { getSession } from "next-auth/client";
import { addCart } from "../../Redux/Cart/cartActions";
import {
    addWishlist,
    removeWishlist,
} from "../../Redux/Wishlist/wishListActions";
import { useRouter } from "next/router";
import { toast, Flip } from "react-toastify";
import {
    reset_Product,
    set_quickViewProduct,
} from "../../Redux/Account/accountActions";
import Portal from "../../component/Portal";
import Filter from "../../component/Filter";
import Breadcrumb from "../../component/Breadcrumb";
import Banner from "../../component/Banner";
import ViewProduct from "../../component/ViewProduct";
import ShopProductGrid from "../../component/ShopProductGrid";
import QuickView from "../../component/QuickView";
import styles from "../../styles/Rutvik.module.css"
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectFade, Autoplay, Navigation } from "swiper";
import { Pagination } from "swiper";
SwiperCore.use([EffectFade, Autoplay, Navigation]);
import ShopProductList from "../../component/ShopProductList";

const dataLimit = 20;

const Shop = (props) => {
    const { products } = props;
    // console.log("props :", props);
    const router = useRouter();

    const { searchProducts } = props.searchProducts;

    let page = parseInt(router.query.page) || 1;

    const { quickViewProduct } = props.quickViewProduct;

    const [view, setView] = useState(true);
    const clicklink = useRef();
    const closeFilter = useRef();
    const [brand, setBrand] = useState([]);
    const [size, setSize] = useState([]);
    const [color, setColor] = useState([]);
    const [colorname, setColorname] = useState("");
    const [select, setSelect] = useState("");
    const [hide, setHide] = useState(false);
    const [sessionUser, setSessionUser] = useState(null);
    const [range, setRange] = useState({ min: 0, max: 2000 });
    // color click store
    const handleChange = (e) => {
        setColorname(e.target.value);
    }
    const handleselect = (e) => {
        setSelect(e.target.value);
    }
    const [data, setData] = useState(props.products);
    // const [filteredData, setFilteredData] = useState([]);

    const getFilter = async (brandName, colorName, sizeType) => {
        try {
            const res = await axios.get(
                brandName.length > 0 ||
                    colorName.length > 0 ||
                    sizeType.length > 0
                    ? `${process.env.HOST}/products/filter?brand=${brandName}&color=${colorName}&size=${sizeType}`
                    : `${process.env.HOST}/products`
            );
            setData(res.data.data);
        } catch (err) {
            toast.info("No More Products", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
                transition: Flip,
            });
            // router.push("404");
        }
    };

    useEffect(() => {
        getFilter(brand, color, size);
    }, [brand, color, size]);
    // const length = searchProducts?.length;
    useEffect(async () => {
        if (searchProducts?.length) {
            setData(searchProducts);
            // props.resetSearchProducts();
            page = 1;
        }
    });

    const getsess = async () => {
        const sess = await getSession();
        // console.log("session",sess);
        setSessionUser(sess);
    }
    const addNewCart = (pId,name,photos,sellingPrice,attributes,quantity) => {
        if (props.user.token) {
            props.addCart({ cart: {pId,name,photos,sellingPrice,attributes,quantity}, token: props.user.token });
        // console.log("cartssss",id,name,price)
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
                                {/* <div className="row"> */}
                                {/* Product gallery */}
                                {quickViewProduct && (
                                    <QuickView product={quickViewProduct} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Portal>
            {/* <div className={`pt-4 pb-5 ${styles.bgImg}`}> */}
            <div className="pt-4 pb-5 bg-dark">
                <div className="container pt-2 pb-3 pt-lg-3 pb-lg-1">
                    <div className="d-lg-flex justify-content-between pb-3">
                        <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                            <Breadcrumb />
                        </div>
                        <div className="order-lg-1 pr-lg-4 text-center text-lg-left">
                            {/* <h1 className="h3 text-light mb-0">Vaistra Shop</h1> */}
                            <h4 className="d-none d-md-block">
                                {searchProducts?.length
                                    ? "Showing Result of Your Search"
                                    : ""}
                            </h4>
                        </div>
                    </div>
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
                        <div className="d-none d-sm-flex">
                            <a
                                className={`btn btn-icon nav-link-style ${view
                                        ? "bg-primary text-light disabled opacity-100 mr-2"
                                        : ""
                                    }`}
                                onClick={() => setView(!view)}
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
                    {hide && <Filter
                        setRange={setRange}
                        range={range}
                        setBrand={setBrand}
                        brand={brand}
                        size={size}
                        setSize={setSize}
                        color={color}
                        setColor={setColor}
                    />
                    }
                </div>
                {/* Products grid*/}
                {view ? (
                    <div className="row mx-n2">
                        {
                            // (filteredData?.length > 0 ? filteredData : data)
                            data?.slice(0, 8).map((product) => {
                                return (
                                    <>
                                        {/* Products grid*/}
                                        <ShopProductGrid
                                            product={product}
                                            token={props.user.token}
                                            wishlists={
                                                props.wishlists.wishlists
                                            }
                                            setColorname={setColorname}
                                            handleselect={handleselect}
                                            handleChange={handleChange}
                                            addWishlist={addWishlist}
                                            addNewCart={addNewCart}
                                            loading={props.carts.loading}
                                            key={product.id}
                                        />
                                        <hr className="my-3" />
                                    </>
                                );
                            })
                        }
                    </div>
                ) : (
                    // (filteredData?.length > 0 ? filteredData : data)
                    data?.slice(0, 8).map((product) => {
                        return (
                            <>
                                <ShopProductList
                                    product={product}
                                    handleChange={handleChange}
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
                {/* Banners*/}
                {props.advertisements && (
                    <Banner advertisements={props.advertisements} />
                )}

                {/* Products grid*/}
                {view ? (
                    <div className="row mx-n2">
                        {data &&
                            data.slice(8, 20).map((product) => {
                                return (
                                    <>
                                        <ShopProductGrid
                                            product={product}
                                            token={props.user.token}
                                            wishlists={
                                                props.wishlists.wishlists
                                            }
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
                    data &&
                    data.slice(8, 20).map((product) => {
                        return (
                            <>
                                <ShopProductList
                                    product={product}
                                    token={props.user.token}
                                    wishlists={props.wishlists.wishlists}
                                    addWishlist={addWishlist}
                                    addNewCart={addNewCart}
                                    clicklink={clicklink}
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
                {/* <li
                            className={`page-item ${
                                page === 1 ? "disabled" : ""
                            }`}
                        >
                            <Link
                                href={`/shop?page=${
                                    page === 1 ? page : +page - 1
                                }`}
                                disabled={page === 1}
                            >
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
                            return ( */}
                {/* //  <button onClick={() => setCurrentPage(item)} key={index}> */}
                {/* <li
                                    className={`page-item d-none d-sm-block ${
                                        page == item ? "active" : ""
                                    } ${
                                        (data?.length < 20) & (item > page)
                                            ? "disabled"
                                            : ""
                                    }`}
                                    key={index} */}
                {/* // style={{ pointerEvents: "none"}}
                                >
                                    <Link
                                        href={`/shop?page=${item}`}
                                        disabled={
                                            (data?.length < 20) & (item > page)
                                                ? true
                                                : false
                                        }
                                    >
                                        <a className="page-link">{item}</a>
                                    </Link>
                                </li>
                                // </button>
                            );
                        })}
                    </ul> */}
                {/* <ul className="pagination"> */}
                {/* <button
              onClick={goToNextPage}
              disabled={data.length < 20 ? true : false}
            > */}
                {/* <li
                            className={`page-item ${
                                data?.length < 20 ? "disabled" : ""
                            }`}
                            style={{
                                pointerEvents: `${
                                    data?.length < 20 ? "none" : ""
                                }`,
                            }}
                        >
                            <Link
                                href={`/shop?page=${
                                    data?.length < 20 ? page : page + 1
                                }`}
                                disabled={data?.length < 20 ? true : false}
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
        // advertisements: state.advertisements,
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

export async function getServerSideProps() {
    const products = await axios
        .get(`${process.env.HOST}/products`)
        .then((res) => {
            return res.data.data;
        })
        .catch((err) => {
            return null;
        });

    const advertisements = await axios
        .get(`${process.env.HOST}/advertisements`)
        .then((res) => {
            return res.data.data;
        })
        .catch((err) => {
            return null;
        });

    return {
        props: {
            products,
            advertisements,
        },
    };
}

// export default Shop;
export default connect(mapStateToProps, mapDispatchToProps)(Shop);
