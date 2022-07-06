import React from 'react'
import Select from "react-select";
const stepFive = () => {
  return (
    <>
        <div>
            <h1></h1>
        </div>
        
        <div className="row">
                <div className="clo-md-6 mb-3 pl-4" style={{ minWidth: "50%" }}>
                    <label className="h6 py-2">Select Bank</label>
                </div>
                <div className="col-md-6 mb-3 " style={{ minWidth: "50%" }}>
                <Select
                        className="react-select text-capitalize"
                        classNamePrefix="react-select"
                        placeholder="Select Bank"
                        id="long-value-select"
                    />
                </div>
            </div>

            <div className="row">
                <div className="clo-md-6 mb-3 pl-4" style={{ minWidth: "50%" }}>
                    <label className="h6 py-2">Select Month</label>
                </div>
                <div className="col-md-6 mb-3 " style={{ minWidth: "50%" }}>
                <Select
                        className="react-select text-capitalize"
                        classNamePrefix="react-select"
                        placeholder="Select Month"
                        id="long-value-select"
                    />
                </div>
            </div>

            <div className="row">
                <div className="clo-md-6 mb-3 pl-4" style={{ minWidth: "50%" }}>
                    <label className="h6 py-2">Enter Interest Rate</label>
                </div>
                <div className="col-md-6 mb-3 " style={{ minWidth: "50%" }}>
                    <input type="text" className="form-control" value="" name="name" placeholder="Enter Interest Rate (ex 13 , 5 , 7)" />
                </div>
            </div>
            <div className="row">
                <div className="clo-md-6 mb-3 pl-4" style={{ minWidth: "50%" }}>
                    <label className="h6 py-2">Enter Monthly Amount</label>
                </div>
                <div className="col-md-6 mb-3 " style={{ minWidth: "50%" }}>
                <input type="text" className="form-control" value="" name="name" placeholder="Enter Monthly Amount" />
                </div>
            </div>
       
    </>
  )
}

export default stepFive