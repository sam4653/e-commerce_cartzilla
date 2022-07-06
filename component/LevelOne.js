import React, { useEffect, useState } from "react";
import axios from "axios";
import LevelTwo from "./LevelTwo";
import Link from "next/link";
import styles from "../styles/Rutvik.module.css"
const LevelOne = () => {
    const [category, setCategory] = useState([]);
    useEffect(() => {
        const getCategory = async () => {
            await axios
                .get(`${process.env.HOST}/category/root`)
                .then((res) => setCategory(res.data.data))
                .catch((err) => {
                    // console.log(err);
                    console.log(err.response.data.message);
                });
        };
        getCategory();
        // return () => setCategory([]);
    }, []);

    return (
        <div className={`dropdown-menu p-0 ${styles.dropshow}`}>
            <div className="d-flex flex-wrap flex-md-nowrap px-2">
                {category &&
                    category.map((c) => {
                        return (
                            <div className="mega-dropdown-column py-4 px-3" style={{ width: "10rem" }} key={c.id} >
                                <div className="widget widget-links mb-3" key={c.id}>
                                    <Link href={`/category/${c.name}`}>
                                        <h6 className="mb-3" style={{ cursor: "pointer" , fontSize:"14px" }}>
                                            {c.name}
                                        </h6>
                                    </Link>
                                    <LevelTwo mainCategory={c.id} mainCategoryName={c.name} />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default LevelOne;
