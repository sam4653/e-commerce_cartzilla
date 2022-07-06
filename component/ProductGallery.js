import ReactImageMagnify from "react-image-magnify";
import { useState } from "react";
import styles from "../styles/Rutvik.module.css"

const ProductGallery = ({ photos, setIsShown, videoLink }) => {
    // videoLink="https://www.youtube.com/watch?v=nGQbA2jwkWI&ab_channel=LecturesbyWalterLewin.Theywillmakeyou%E2%99%A5Physics."
    // console.log(videoLink)
    const [imageActive, setImageActive] = useState(0);
    const [videoCheck, setVideoCheck] = useState("");


    const check = () => {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = videoLink.match(regExp);
        // console.log("VideoLink:", videoLink)
        var videoMake = (match && match[7].length == 11) ? match[7] : false;
        // console.log("videomake :", videoMake)
        setVideoCheck(videoMake)

    }

    return (
        <div className={`cz-product-gallery  ${styles.checkhover}`} >
            <div className="cz-preview order-sm-2 d-lg-block">
                <div className={`cz-preview-item active d-none d-sm-block`} onMouseEnter={() => setIsShown(false)} onMouseLeave={() => setIsShown(true)}>
                    <ReactImageMagnify
                        {...{
                            smallImage: {
                                alt: "Product Image",
                                src: photos && photos[imageActive],
                                // width: 505,
                                width: 570,
                                height: 640,
                            },
                            largeImage: {
                                src: photos && photos[imageActive],
                                width: 570,
                                height: 1800,
                            },
                        }}
                        
                    />
                </div>

                <div className="cz-preview-item active d-lg-none d-block"><img className="cz-image-zoom" src={photos && photos[imageActive]} data-zoom={photos && photos[imageActive]} alt="Product image" style={{width:"100%" , height:"70vh"}}/>
                    <div className="cz-image-zoom-pane"></div>
                  </div>
            </div>
            <div className="cz-thumblist order-sm-1">
                {photos &&
                    photos.map((image, index) => {
                        return (
                            <div
                                className={`cz-thumblist-item ${index === imageActive ? "active" : ""
                                    }`}
                                onClick={() => setImageActive(index)}
                                key={index}
                            >
                                <img
                                    src={image}
                                    alt="Product thumb"
                                    style={{ height: "80px", width: "80px" }}
                                />
                            </div>
                        );
                    })}
                {/* <a
                    className="cz-thumblist-item video-item"
                >
                    <div className="cz-thumblist-item-text">
                        <i className="czi-video" />
                        Video
                    </div>
                </a> */}

                {videoLink &&
                    <div className="bs-example">
                        <a
                            className="cz-thumblist-item video-item"
                            data-target="#openVideo" data-toggle="modal" onClick={check}
                        >
                            <div className="cz-thumblist-item-text">
                                <i className="czi-video" />
                                Video
                            </div>
                        </a>
                        <div id="openVideo" className="modal fade">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    {/* <div className="modal-header">
                                        <button type="button"
                                            className="close"
                                            data-dismiss="modal"
                                            aria-hidden="true">×</button>
                                    </div> */}
                                    <div className="modal-body">
                                        <iframe width="450" height="350"
                                            src=
                                            {`https://www.youtube.com/embed/${videoCheck}`}
                                            frameBorder="0" allowFullScreen>
                                        </iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default ProductGallery;