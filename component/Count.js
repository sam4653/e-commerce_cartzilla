import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Count = ({ catId, subCat, brand }) => {
    // console.log(catId, subCat, brand);
    const router = useRouter();
    const [value, setValue] = useState(0);
    useEffect(async () => {
        router.isReady &&
            (await axios
                .get(
                    `${process.env.HOST}/products/count?cat=${catId}&subCate=${subCat}&brand=${brand}`
                    // cat=&subCate=Shoes&size=L&brand=amazon
                )
                .then((res) => {
                    // console.log(res.data.count);
                    setValue(res.data.count);
        
                })
                .catch((err) => console.log(err.response.data)));
    }, []);

    return value;
};

export default Count;
