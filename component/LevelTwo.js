import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import LevelThree from "./LevelThree";

const LevelTwo = ({ mainCategory, mainCategoryName }) => {
    //   console.log("MC ", mainCategory);
    const [subCategory, setSubCategory] = useState([]);
    // useEffect(async () => {
    //     await axios
    //         .get(`${process.env.HOST}/category/sub/${mainCategory}`)
    //         .then((res) => {
    //             setSubCategory(res.data.data);
    //         })
    //         .catch((err) => {
    //             // console.log(err.response.data);
    //         });
    // }, []);
    return (
        <ul className="widget-list" >
            {subCategory &&
                subCategory.map((sc) => {
                    return (
                        <li className="widget-list-item pb-1" key={sc.id}  >
                            <Link
                                href={`/shop/${mainCategoryName}/${sc.name
                                    .split(" ")
                                    .join("_")}`}
                                key={sc.id}>
                                <a className="widget-list-link pb-1" style={{fontSize:"13px" , color:"red"}}>{sc.name}</a>
                            </Link>
                            <LevelThree mainCategory={sc.id} mainCategoryName={sc.name} />
                        </li>
                    );
                })}
        </ul>
    );
};

export default LevelTwo;
