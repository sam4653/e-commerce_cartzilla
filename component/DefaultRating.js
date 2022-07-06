import React from 'react'

export default function DefaultRating({ no_Of_Reviews, rating }) {
    // console.log("props",props)
    // const length = (props.review).length
    // console.log("Length", length)
    // console.log("conter",props.No_Of_Reviews)
    const calculation = rating.value / no_Of_Reviews * 100
    // console.log("calculation",calculation)
    return (
        <div className="d-flex align-items-center mb-2">
            <div className="text-nowrap mr-3"><span className="d-inline-block align-middle text-muted">{rating.rating ? rating.rating : 0}</span><i
                className="czi-star-filled font-size-xs ml-1"></i></div>
            <div className="w-100">
                <div className="progress" style={{ height: "4px" }}>
                    <div className="progress-bar" role="progressbar" id={`progressId${rating.value ? rating.value : 0}`} style={{ width: `${calculation > 100 ? 100 : calculation}%` }} aria-valuenow="60"
                        aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div><span className="text-muted ml-3">{rating.value ? rating.value : 0}</span>
        </div>
    )
}
