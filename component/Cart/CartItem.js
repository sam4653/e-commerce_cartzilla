import Link from "next/link";

const CartItem = ({ cart }) => {
    // console.log("CarrData",cart)
    
    return (
        <div className="media align-items-center pb-2 border-bottom">
            <Link href={`/single/${cart.name}?id=${cart.pId}`}>
                <a className="d-block mr-2">
                    {/* href="shop-single-v1.html"*/}
                    <img
                        width={64}
                        height={64}
                        src={cart?.photos[0]}
                        alt="Product Image"
                    />
                </a>
            </Link>
            <div className="media-body">
                <h6 className="widget-product-title line-clamp">
                    <Link href={`/single/${cart.name}?id=${cart.pId}`}>
                        <a>{cart.name}</a>
                    </Link>
                </h6>
                <div className="widget-product-meta">
                    <span className="text-accent mr-2">
                    ₹{cart.sellingPrice ? cart.sellingPrice : cart.offerPrice }.<small>00</small>
                    </span>
                    <span className="text-muted">x {cart.quantity}</span>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
