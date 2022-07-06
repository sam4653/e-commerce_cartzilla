import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const LevelThree = ({ mainCategory, mainCategoryName, menuName }) => {
    //   console.log("MC ", mainCategory);
    const [subCategory, setSubCategory] = useState([]);
    const [rootCategory, setRootCategory] = useState([]);
    useEffect(async () => {
        await axios
            .get(`${process.env.HOST}/category/sub/${mainCategory}`)
            .then((res) => {
                setSubCategory(res.data.data);
            })
            .catch((err) => {
                // console.log(err.response.data);
            });

        await axios
            .get(`${process.env.HOST}/category/root`)
            .then((res) => {
                setRootCategory(res.data.data);
            })
            .catch((err) => {
                // console.log(err.response.data);
            });
    }, []);
    return (
        <div className="dropdown-submenu ">
            <ul className="widget-list" >
                {subCategory &&
                    subCategory.map((sc) => {
                        return (
                            <li className="widget-list-item pb-1" key={sc.id}  >
                                {/* {console.log(first)} */}
                                <Link
                                    href={`/shop/${menuName.replace(' & ', 'And')}/${mainCategoryName}/${sc.name.replace(' & ', 'And')
                                        .split(" ")
                                        .join("_")}`}
                                    key={sc.id}>
                                    <a className="widget-list-link" style={{ fontSize: "13px" }}>{sc.name}</a>
                                </Link>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

export default LevelThree;
