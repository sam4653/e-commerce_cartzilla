import axios from "axios";
import { useEffect, useState } from "react";
import Count from "./Count";
import Range from "./Range";
import ShopCategories from "./ShopCategories";

const sizeData = [
    { type: "XS", value: 34 },
    { type: "S", value: 57 },
    { type: "M", value: 198 },
    { type: "L", value: 72 },
    { type: "X", value: 46 },
    { type: "39", value: 112 },
    { type: "40", value: 85 },
    { type: "41", value: 210 },
    { type: "42", value: 57 },
    { type: "43", value: 30 },
    { type: "44", value: 61 },
    { type: "45", value: 23 },
    { type: "46", value: 19 },
    { type: "47", value: 15 },
    { type: "48", value: 12 },
    { type: "49", value: 8 },
    { type: "50", value: 6 },
];

const colorData = [
    { name: "Blue-gray", value: "#b3c8db" },
    { name: "Burgundy", value: "#ca7295" },
    { name: "Teal", value: "#91c2c3" },
    { name: "Brown", value: "#9a8480" },
    { name: "Coral red", value: "#ff7072" },
    { name: "Navy", value: "#696dc8" },
    { name: "Charcoal", value: "#4e4d4d" },
    { name: "Sky blue", value: "#8bcdf5" },
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ff0000" },
    { name: "White", value: "#ffffff" },
];

// const getsubid=()=>{

//       if(storeid){
//         return storeid;
//       }else{
//         return;
//       }


const Filter = ({
    range,
    setRange,
    setBrand,
    getFilter,
    brand,
    size,
    setSize,
    color,
    setColor,
}) => {
    // const [range, setRange] = useState({ min: 2000, max: 5000 });
    const [brands, setBrands] = useState([]);
    const [categoryId, setcategoryId] = useState("");
    const [subid, setSubid] = useState("");
    // const [subcategoryId , setSubcategoryId] = useState(getsubid()); 
    const [mainCategories, setMainCategories] = useState([]);
    useEffect(() => {
        // }
        // storeid = localStorage.getItem("subid");
        // const getBrands = async () => {
        //     try {
        //       const res = await axios.get(`${process.env.HOST}/brand/${categoryId}/${subid}`);
        //         setBrands(res.data.data);
        //         console.log(res.data.data);
        //         alert("ok")
        //     } catch (err) {
        //         console.log(err?.response?.data);

        //     }
        // };
        const getMainCategories = async () => {
            try {
                const res = await axios.get(`${process.env.HOST}/category/root`);
                setMainCategories(res.data.data);
                // console.log(res.data.data);
            } catch (err) {
                console.log(err.response.data);
            }
        };
        getMainCategories();

    }, []);

    const handleChange = (e) => {
        if (e.target.checked) setBrand((prev) => [...prev, e.target.name]);
        else setBrand(brand.filter((b) => b !== e.target.name));
    };

    const handleclick = (id) => {
        setSubid(id);
        axios.get(`${process.env.HOST}/brand/${categoryId}/${id}`).then((res) => {
            // console.log(res.data.data);
            setBrands(res.data.data);
        }).catch((error) => {
            console.log(error);
        })
    }
    const handleSizeChange = (e) => {
        if (e.target.checked) {
            setSize((prev) => [...prev, e.target.name]);
        } else {
            setSize(size.filter((b) => b !== e.target.name));
        }
    };

    const handlesearch = (e) => {

        let fliter = brands.filter((brand) => {
            return brand.name.toLowerCase().includes(e.target.value.toLowerCase())
        })
        if (e.target.value) {
            setBrands(fliter)

        } else {
            setBrands(brands)
        }
    }

    const handleColorChange = (e) => {
        if (e.target.checked) {
            setColor((prev) => [...prev, e.target.name]);
        } else {
            setColor(color?.filter((b) => b !== e.target.name));
        }
    };
    return (
        <div className="collapse" id="shop-filters">
            <div className="row pt-4">
                <div className="col-lg-4 col-sm-6">
                    {/* Categories*/}
                    <div className="card mb-grid-gutter">
                        <div className="card-body px-4">
                            <div className="widget widget-categories">
                                <h3 className="widget-title">Categories</h3>
                                <div
                                    className="accordion mt-n1"
                                    id="shop-categories"
                                >
                                    {mainCategories?.map((mainCat) => {
                                        return (
                                            <div
                                                className="card text-capitalize"
                                                key={mainCat.id}
                                            >
                                                <div className="card-header">
                                                    <h3 className="accordion-heading">
                                                        <a
                                                            className="collapsed"
                                                            href={`#${mainCat.name
                                                                .split(" & ")
                                                                .join("")}`}
                                                            role="button"
                                                            data-toggle="collapse"
                                                            aria-expanded="false"
                                                            aria-controls={mainCat.name
                                                                .split(" & ")
                                                                .join("")}

                                                            onClick={(e) => {
                                                                setcategoryId(mainCat.id); localStorage.removeItem("subid")
                                                            }}
                                                        >
                                                            {mainCat.name}
                                                            <span className="accordion-indicator" />
                                                        </a>
                                                    </h3>
                                                </div>
                                                <div
                                                    className="collapse"
                                                    id={mainCat.name
                                                        .split(" & ")
                                                        .join("")}
                                                    data-parent="#shop-categories"
                                                >
                                                    <ShopCategories category={mainCat} handleclick={handleclick} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-sm-6">
                    {/* Price range*/}
                    <div className="card mb-grid-gutter">
                        <div className="card-body px-4">
                            <div className="widget">
                                <h3 className="widget-title">Price range</h3>
                                <Range onChange={setRange} value={range} />
                                <div className="cz-range-slider-ui" />
                                <div className="d-flex pb-1">
                                    <div className="w-50 pr-2 mr-2">
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    ₹
                                                </span>
                                            </div>
                                            <input
                                                className="form-control cz-range-slider-value-min"
                                                type="number"
                                                value={range.min}
                                                onChange={(e) => {
                                                    if (
                                                        +e.target.value <
                                                        range.max &&
                                                        +e.target.value > 0
                                                    ) {
                                                        setRange({
                                                            ...range,
                                                            min: +e.target
                                                                .value,
                                                        });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-50 pl-2">
                                        <div className="input-group input-group-sm">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    ₹
                                                </span>
                                            </div>
                                            <input
                                                className="form-control cz-range-slider-value-max"
                                                type="number"
                                                value={range.max}
                                                onChange={(e) => {
                                                    if (
                                                        +e.target.value >
                                                        range.min &&
                                                        +e.target.value < 10000
                                                    ) {
                                                        setRange({
                                                            ...range,
                                                            max: +e.target
                                                                .value,
                                                        });
                                                    }
                                                }}
                                            // onChange={console.log("Max")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Filter by Brand*/}
                    <div className="card mb-grid-gutter">
                        <div className="card-body px-4">
                            <div className="widget cz-filter">
                                <h3 className="widget-title">Brand</h3>
                                <div className="input-group-overlay input-group-sm mb-2">
                                    <input
                                        className="cz-filter-search form-control form-control-sm appended-form-control"
                                        type="text"
                                        placeholder="Search"
                                        onInput={(e) => { handlesearch(e) }}
                                    />
                                    <div className="input-group-append-overlay">
                                        <span className="input-group-text">
                                            <i className="czi-search" />
                                        </span>
                                    </div>
                                </div>
                                <ul
                                    className="widget-list cz-filter-list list-unstyled pt-1"
                                    style={{ maxHeight: "12rem" }}
                                    data-simplebar
                                    data-simplebar-auto-hide="false"
                                >
                                    {brands && brands?.map((brand) => {
                                        return (
                                            <li
                                                className="cz-filter-item d-flex justify-content-between align-items-center mb-1"
                                                key={brand.id}
                                            >
                                                <div className="custom-control custom-checkbox  text-capitalize">
                                                    <input
                                                        className="custom-control-input"
                                                        style={{ zIndex: 1 }}
                                                        type="checkbox"
                                                        id={brand.id}
                                                        name={brand.name}
                                                        // value={brand.name}
                                                        // checked = {checked}
                                                        onChange={handleChange}
                                                    />
                                                    <label
                                                        className="custom-control-label cz-filter-item-text"
                                                        htmlFor="adidas"
                                                    >
                                                        {brand.name}
                                                    </label>
                                                </div>
                                                <span className="font-size-xs text-muted">
                                                    <Count
                                                        brand={brand.name}
                                                        catId=""
                                                        subCat=""
                                                    />
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-sm-6">
                    {/* Filter by Size*/}
                    <div className="card mb-grid-gutter">
                        <div className="card-body px-4">
                            <div className="widget cz-filter">
                                <h3 className="widget-title">Size</h3>
                                <div className="input-group-overlay input-group-sm mb-2">
                                    <input
                                        className="cz-filter-search form-control form-control-sm appended-form-control"
                                        type="text"
                                        placeholder="Search"
                                    />
                                    <div className="input-group-append-overlay">
                                        <span className="input-group-text">
                                            <i className="czi-search" />
                                        </span>
                                    </div>
                                </div>
                                <ul
                                    className="widget-list cz-filter-list list-unstyled pt-1"
                                    style={{ maxHeight: "12rem" }}
                                    data-simplebar
                                    data-simplebar-auto-hide="false"
                                >
                                    {sizeData.map((size) => {
                                        return (
                                            <li key={size.type} className="cz-filter-item d-flex justify-content-between align-items-center mb-1">
                                                <div className="custom-control custom-checkbox">
                                                    <input
                                                        className="custom-control-input"
                                                        style={{ zIndex: 9 }}
                                                        type="checkbox"
                                                        id={size.type}
                                                        name={size.type}
                                                        onChange={
                                                            handleSizeChange
                                                        }
                                                    />
                                                    <label className="custom-control-label cz-filter-item-text" htmlFor="size-xs">
                                                        {size.type}
                                                    </label>
                                                </div>
                                                <span className="font-size-xs text-muted">
                                                    {size.value}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* Filter by Color*/}
                    <div className="card mb-grid-gutter">
                        <div className="card-body px-4">
                            <div className="widget">
                                <h3 className="widget-title">Color</h3>
                                <div className="d-flex flex-wrap">
                                    {colorData.map((c) => {
                                        return (
                                           <>
                                           <div
                                                className="custom-control custom-option text-center mb-2 mx-1"
                                                style={{ width: "4rem" }}
                                            >
                                                <input
                                                    className="custom-control-input"
                                                    type="checkbox"
                                                    style={{ zIndex: 9 }}
                                                    id={c.name}
                                                    name={c.name}
                                                    onChange={(e) =>
                                                        handleColorChange(e)
                                                    }
                                                />
                                                <label
                                                    className="custom-option-label rounded-circle"
                                                    htmlFor={c.name}
                                                >
                                                    <span
                                                        className="custom-option-color rounded-circle"
                                                        style={{
                                                            backgroundColor:
                                                                c.value,
                                                        }}
                                                    />
                                                </label>
                                                <label
                                                    className="d-block font-size-xs text-muted mt-n1"
                                                    htmlFor={c.name}
                                                >
                                                    {c.name}
                                                </label>
                                            </div>
                                           </>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
