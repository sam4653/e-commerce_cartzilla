import React, { useState, useEffect } from 'react'
import axios from 'axios';
import DefaultRating from './DefaultRating';
import { getSession } from "next-auth/client";
import Ratings from 'react-ratings-declarative';

const rating = [
    { rating: 1, value: 0 },
    { rating: 2, value: 0 },
    { rating: 3, value: 0 },
    { rating: 4, value: 0 },
    { rating: 5, value: 0 },

]
const Reviews = (props) => {
    const { product } = props;
    // const { setRating } = props.setRating;
    // console.log("product", setRating)
    const [review, setReview] = useState([]);
    const [noOfReview, setnoOfReview] = useState("");
    const [user, setUser] = useState("");
    function calcAverageRating(review) {

        let totalWeight = 0;
        let totalReviews = 0;

        review?.ratings?.forEach((reviews) => {
            const weightMultipliedByNumber = reviews.rating * reviews.count;
            totalWeight += weightMultipliedByNumber;
            totalReviews += reviews.count;
        });

        const averageRating = totalWeight / totalReviews;
        // console.log("calcAverageRating", averageRating.toFixed(2));
        // return averageRating.toFixed(2);
    }
    useEffect(async () => {
        const getReview = async () => {
            try {
                const res = await axios.get(
                    `${process.env.HOST}/reviews/${product.id}/ratings`
                );
                for (const ad of res.data.data.ratings) {
                    rating[ad.rating - 1].value = ad.count
                }
                setReview(res.data.data);
                // console.log("Rating Data::", review)
                props.setRating({ totalReviews: res.data.data.No_Of_Reviews, averageRating: res.data.data.Average_Ratings })
                setnoOfReview(res.data.data.No_Of_Reviews);
            } catch (err) {
                console.log(err);
            }
        };
        calcAverageRating(review);
        getReview();
    }, []);


    const [productReview, setProductReview] = useState([]);
    useEffect(async () => {
        const sess = await getSession();
        setUser(sess);
        const getProductReview = async () => {


            try {
                const res = await axios.get(
                    `${process.env.HOST}/reviews/${product.id}`, {
                    headers: { Authorization: sess.accessToken }
                },
                );
                // console.log("Product Review Data::", productReview)
                setProductReview(res.data.data);
            } catch (err) {
                console.log(err.response);
            }
        };
        getProductReview();
    }, []);

    const avRating = review.Average_Ratings / 5 * 100

    return (
        <div className="row">
            {/* <!-- Reviews--> */}
            <div className="container pt-md-2" id="reviews">
                <div className="row pb-3">
                    <div className="col-lg-4 col-md-5">
                        <h2 className="h3 mb-4">{noOfReview ? noOfReview : 0} Reviews</h2>
                        {/* <i className="czi-star-filled font-size-sm text-accent mr-1"></i>
                        <i className="czi-star-filled font-size-sm text-accent mr-1"></i>
                        <i className="czi-star-filled font-size-sm text-accent mr-1"></i>
                        <i className="czi-star-filled font-size-sm text-accent mr-1"></i>
                        <i className="czi-star font-size-sm text-muted mr-1"></i> */}

                        <Ratings rating={Number(review.Average_Ratings ? review.Average_Ratings : 0)} widgetDimensions="20px" widgetSpacings="3px" >
                            <Ratings.Widget widgetRatedColor="#fea569" />
                            <Ratings.Widget widgetRatedColor="#fea569" />
                            <Ratings.Widget widgetRatedColor="#fea569" />
                            <Ratings.Widget widgetRatedColor="#fea569" />
                            <Ratings.Widget widgetRatedColor="#fea569" />
                        </Ratings>
                        <span className="d-inline-block align-middle">&nbsp; {review.Average_Ratings ? review.Average_Ratings : 0} Overall rating</span>
                        <p className="pt-3 font-size-sm text-muted">{review.Average_Ratings ? review.Average_Ratings : 0} out of 5 ({avRating ? avRating : 0}%)<br />Customers recommended this product</p>
                    </div>
                    <div className="col-lg-8 col-md-7">
                        {noOfReview && rating.map((r) => {
                            return <DefaultRating rating={r} no_Of_Reviews={noOfReview} />
                        })
                        }

                    </div>
                </div>
                <hr className="mt-4 pb-4 mb-3" />
                <div className="row">
                    {/* <!-- Reviews list--> */}
                    <div className="col-md-12">
                        <div className="d-flex justify-content-end pb-4">
                            <div className="form-inline flex-nowrap">
                                <label className="text-muted text-nowrap mr-2 d-none d-sm-block" for="sort-reviews">Sort by:</label>
                                <select className="custom-select custom-select-sm" id="sort-reviews">
                                    <option>Newest</option>
                                    <option>Oldest</option>
                                    <option>Popular</option>
                                    <option>High rating</option>
                                    <option>Low rating</option>
                                </select>
                            </div>
                        </div>
                        {/* <!-- Review--> */}
                        {productReview.length !== 0 ? (
                            productReview?.map((pr, index) => {
                                
                                // console.log("product", productReview)
                                return (
                                    
                                    <div className="product-review pb-4 mb-4 border-bottom" key={index}>
                                        <div className="d-flex mb-3 justify-content-between">
                                            <div className="media media-ie-fix align-items-center mr-4 pr-2">
                                                <img className="rounded-circle" width="50" src="/img/shop/reviews/01.jpg" alt="Rafael Marquez" />
                                                <div className="media-body pl-3">
                                                    <h6 className="font-size-sm mb-0">Rafael Marquez</h6>
                                                    {/* <span className="font-size-ms text-muted">May 17,2019</span> */}
                                                    <span className="font-size-ms text-muted">{pr?.createdAt?.replace(/\T.*/g, "$'")}</span>
                                                    {/* <span className="font-size-ms text-muted">new Date(d.createdAt).toLocaleDateString()</span> */}
                                                </div>
                                            </div>
                                            <div>
                                                {/* <div className="star-rating">
                                                    <i className="sr-star czi-star-filled active"></i>
                                                    <i className="sr-star czi-star-filled active"></i>
                                                    <i className="sr-star czi-star-filled active"></i>
                                                    <i className="sr-star czi-star-filled active"></i>
                                                    <i className="sr-star czi-star"></i>
                                                </div> */}
                                                <Ratings rating={Number(pr.rating ? pr.rating : 0)} widgetDimensions="18px" widgetSpacings="0px" >
                                                    <Ratings.Widget widgetRatedColor="#fea569" />
                                                    <Ratings.Widget widgetRatedColor="#fea569" />
                                                    <Ratings.Widget widgetRatedColor="#fea569" />
                                                    <Ratings.Widget widgetRatedColor="#fea569" />
                                                    <Ratings.Widget widgetRatedColor="#fea569" />
                                                </Ratings>
                                                <div className="font-size-ms text-muted">{pr.rating ? pr.rating / 5 * 100 : 0}% of users found this review helpful</div>
                                                {/* <div className="font-size-ms text-muted">83% of users found this review helpful</div> */}
                                            </div>
                                        </div>
                                        <p className="font-size-md mb-2">{pr.review}</p>
                                        <ul className="list-unstyled font-size-ms pt-1">
                                            <li className="mb-1">
                                                <span className="font-weight-medium">Pros:&nbsp;</span>
                                                {pr.pros}
                                            </li>
                                            <li className="mb-1">
                                                <span className="font-weight-medium">Cons:&nbsp;</span>
                                                {pr.cons}
                                            </li>
                                        </ul>
                                        <div className="text-nowrap">
                                            <button className="btn-like" type="button"> {pr.likes ? pr.likes : 0}</button>
                                            <button className="btn-dislike" type="button"> {pr.dislikes ? pr.dislikes : 0}</button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-md-12">
                                <div className="alert alert-warning" role="alert">
                                    {user ? "No Review Available for this Product." : "Please Enter Your Login Details Then  After See The Review"}
                                </div>
                            </div>
                        )}
                        {/* <!-- Review--> */}
                        {/* <div className="product-review pb-4 mb-4 border-bottom">
                            <div className="d-flex mb-3">
                                <div className="media media-ie-fix align-items-center mr-4 pr-2"><img className="rounded-circle" width="50"
                                    src="/img/shop/reviews/02.jpg" alt="Barbara Palson" />
                                    <div className="media-body pl-3">
                                        <h6 className="font-size-sm mb-0">Barbara Palson</h6><span className="font-size-ms text-muted">May 17,
                                            2019</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="star-rating"><i className="sr-star czi-star-filled active"></i><i
                                        className="sr-star czi-star-filled active"></i><i className="sr-star czi-star-filled active"></i><i
                                            className="sr-star czi-star-filled active"></i><i className="sr-star czi-star-filled active"></i>
                                    </div>
                                    <div className="font-size-ms text-muted">99% of users found this review helpful</div>
                                </div>
                            </div>
                            <p className="font-size-md mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <ul className="list-unstyled font-size-ms pt-1">
                                <li className="mb-1"><span className="font-weight-medium">Pros:&nbsp;</span>Consequuntur magni, voluptatem sequi,
                                    tempora</li>
                                <li className="mb-1"><span className="font-weight-medium">Cons:&nbsp;</span>Architecto beatae, quis autem</li>
                            </ul>
                            <div className="text-nowrap">
                                <button className="btn-like" type="button">34</button>
                                <button className="btn-dislike" type="button">1</button>
                            </div>
                        </div> */}
                        {/* <!-- Review--> */}
                        {/* <div className="product-review pb-4 mb-4 border-bottom">
                            <div className="d-flex mb-3">
                                <div className="media media-ie-fix align-items-center mr-4 pr-2"><img className="rounded-circle" width="50"
                                    src="/img/shop/reviews/03.jpg" alt="Daniel Adams" />
                                    <div className="media-body pl-3">
                                        <h6 className="font-size-sm mb-0">Daniel Adams</h6><span className="font-size-ms text-muted">May 8,
                                            2019</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="star-rating"><i className="sr-star czi-star-filled active"></i><i
                                        className="sr-star czi-star-filled active"></i><i className="sr-star czi-star-filled active"></i><i
                                            className="sr-star czi-star"></i><i className="sr-star czi-star"></i>
                                    </div>
                                    <div className="font-size-ms text-muted">75% of users found this review helpful</div>
                                </div>
                            </div>
                            <p className="font-size-md mb-2">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                                beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem.</p>
                            <ul className="list-unstyled font-size-ms pt-1">
                                <li className="mb-1"><span className="font-weight-medium">Pros:&nbsp;</span>Consequuntur magni, voluptatem sequi
                                </li>
                                <li className="mb-1"><span className="font-weight-medium">Cons:&nbsp;</span>Architecto beatae, quis autem,
                                    voluptatem sequ</li>
                            </ul>
                            <div className="text-nowrap">
                                <button className="btn-like" type="button">26</button>
                                <button className="btn-dislike" type="button">9</button>
                            </div>
                        </div>
                    <div className="text-center">
                        <button className="btn btn-outline-accent" type="button"><i className="czi-reload mr-2"></i>Load more
                            reviews</button>
                    </div>
                    */}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Reviews;