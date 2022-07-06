import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import LevelThree from "./LevelThree";
import styles from "../styles/Rutvik.module.css"

const SubType = ({ menuId, menuName }) => {
    const [subCategory, setSubCategory] = useState([]);
    useEffect(() => {
        const getCategory = async () => {
            await axios
                .get(`${process.env.HOST}/category/sub/${menuId}`)
                .then((res) => {
                    // console.log("respomse",res.data.data)
                setSubCategory(res.data.data)
                })
                .catch((err) => {
                    // console.log(err);
                    console.log(err.response.data.message);
                });
        };
        getCategory();
        // return () => setCategory([]);
    }, []);

    return (
        <div className={`dropdown-menu p-0 ${styles.dropshow} `}>
            <div className="px-2 displaySet">
                {subCategory &&
                    subCategory.map((sc) => {
                        return (
                            <>
                                <div className="py-2 px-3" style={{ width: "10rem" }} key={sc.id} >
                                    <li className="widget-list-item pb-1" key={sc.id}>
                                        <Link
                                            href={`/shop/${menuName.replace(' & ', 'And')}/${sc.name.replace(' & ', 'And')
                                                .split(" ")
                                                .join("_")}`}
                                            key={sc.id}>
                                            <a className="widget-list-link font-weight-bold">{sc.name}</a>
                                        </Link>
                                    </li>
                                    <LevelThree mainCategory={sc.id} menuName={menuName} mainCategoryName={sc.name} />
                                </div>
                            </>
                        );
                    })}
            </div>
        </div>
    );
};

export default SubType;
