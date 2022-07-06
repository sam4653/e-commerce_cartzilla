import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import Count from "./Count";

const ShopCategories = ({ category,handleclick }) => {
    const [subCategory, setSubCategory] = useState([]);
    const [subCategoryId, setSubCategoryId] = useState();
   
    useEffect(() => {
        const getSubCategory = async () => {
            try {
                const res = await axios.get(
                    `${process.env.HOST}/category/sub/${category.id}`
                );
                setSubCategory(res.data.data);
                
            } catch (err) {
                // console.log(err.response.data);
            }
        };
        getSubCategory();
    }, []);

    useEffect(()=>{
          localStorage.setItem("subid",subCategoryId);
    },[subCategoryId])

    return (
        <div className="card-body">
            <div className="widget widget-links cz-filter">
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
                <ul className="widget-list cz-filter-list pt-1" style={{ height: "12rem",overflowY:"auto" }}>
                    <li className="widget-list-item cz-filter-item">
                        <Link href={`/shop/${category.name.split(" ").join("_")}`}>
                            <a className="widget-list-link d-flex justify-content-between align-items-center">
                                <span className="cz-filter-item-text">
                                    View all
                                </span>
                                <span className="font-size-xs text-muted ml-3">
                                    <Count catId={category.id} subCat="" />
                                </span>
                            </a>
                        </Link>
                    </li>
                    {subCategory?.map((sc) => {
                        // count(sc.name);
                        return (
                            <li
                                className="widget-list-item cz-filter-item"
                                key={sc.id}
                            >
                                
                                    <a className="widget-list-link d-flex justify-content-between align-items-center" style={{cursor:"pointer"}}  onClick={()=>{handleclick(sc.id)}}>
                                        <span className="cz-filter-item-text">
                                            {sc.name}
                                        </span>
                                        <span className="font-size-xs text-muted ml-3">
                                            <Count
                                                catId={category.id}
                                                subCat={sc.name}
                                            />
                                        </span>
                                    </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
// export async function getServerSideProps({params,req,res,query,preview,previewData,resolvedUrl,locale,locales,defaultLocale}) {
//     console.log('Logging : '+res);
//     const data = await fetch('https://jsonplaceholder.typicode.com/users');
//     const users = await data.json();
//     return { props: { users } }
//   }

export default ShopCategories;
