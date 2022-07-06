import React from 'react'
import ReactLoading from "react-loading";

const Loader = () => {

    return (
        // <div className="d-flex justify-content-center mt-3" >
        //     <ReactLoading
        //         type={"bubbles"}
        //         color={"#a14243"}
        //         height={100}
        //         width={100}
        //         className="r-loading"
        //     />
        // </div>
        <div className="loadingBars">
            <ReactLoading type="bars" color="#666362"
                height={100} width={70} />
        </div>
    )
}

export default Loader
