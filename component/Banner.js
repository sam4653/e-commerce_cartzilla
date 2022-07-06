import Link from "next/link";

const Banner = ({ advertisements }) => {
    // console.log("B : ", advertisements);
    return (
        advertisements && (
            <div className="row py-sm-2">
                {advertisements.map((a, k) => {
                    return (
                        <div className="col-md-6 mb-4">
                            <div className="d-sm-flex justify-content-between align-items-center bg-secondary overflow-hidden rounded-lg" style={{ width: "100%", height: "100%" }}>

                                <div className="py-4 my-2 my-md-0 py-md-5 px-4 ml-md-3 text-center text-sm-left">
                                    <h4 className="font-size-lg font-weight-light mb-2">
                                        {a.title}
                                    </h4>
                                    <h3 className="mb-4">
                                          {" "}
                                        {a.tagline}{" "}
                                    </h3>
                                    <Link href="/shop   ">
                                        <a className="btn btn-primary btn-shadow btn-sm">
                                            Shop Now
                                        </a>
                                    </Link>
                                </div>
                                <div className="imgCenter">
                                    <img
                                        style={{ width: "280px", height: "150px" }}
                                        className="d-block"
                                        src={a.image ? a.image : "No banner available"}
                                        alt={a.title}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
                {/* <div className="col-md-6 mb-4">
                    <div
                        className="d-flex flex-column h-100 bg-size-cover bg-position-center rounded-lg py-4"
                        style={{
                            backgroundImage: "url(/img/blog/banner-bg.jpg)",
                        }}
                    >
                        <div className="py-4 my-2 px-4 text-center">
                            <h5 className="mb-2">Your Add Banner Here</h5>
                            <p className="font-size-sm text-muted">
                                Hurry up to reserve your spot
                            </p>
                            <Link href="/contact">
                                <a className="btn btn-primary btn-shadow btn-sm">
                                    Contact us
                                </a>
                            </Link>
                        </div>
                    </div>
                </div> */}
            </div>
        )
    );
};

export default Banner;
