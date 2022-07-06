import Link from "next/link";
import Head from "next/head";

const PageNotFound = () => {

  return (
    <>
      <Head>
        <title>Vaistra Ecommerce | Page 404</title>
      </Head>
      <div className="container py-5 mb-lg-3" >
        <div className="row  justify-content-center w-100 pt-lg-4 text-center" style={{display:"flex" , justifyContent:"center" , alignItems:"center" , flexDirection:"column" , width:"100%"} }>
          <div className="col-lg-5 col-md-7 col-sm-9">
            <img
              className="d-block mx-auto mb-5"
              src="/img/pages/404.png"
              width="340"
              alt="404 Error"
            />
            <h1 className="h3 ">
              Page Not Found
            </h1>
            <h3 className="h5 font-weight-normal mb-4">
              Sorry ! we are unable to find the page you are looking for.
            </h3>
          </div>
        </div>
        <div  style={{display:"flex" , justifyContent:"center" , alignItems:"center" , flexDirection:"column" , width:"100%"} }>
          <div className="col-xl-8 col-lg-10">
            <div className="row">
              <div className="col-sm-4 mb-3"></div>
              <div className="col-sm-4 mb-3 " >
                <Link href="/">
                  <a className="card h-100 border-0 box-shadow-sm "  href="/">
                    <div className="card-body " >
                      <div className="media align-items-center" >
                        <i className="czi-home text-primary h4 mb-0"></i>
                        <div className="media-body pl-3">
                          <h5 className="font-size-sm mb-0 ">Homepage</h5>
                          <span className="text-muted font-size-ms">
                            Return to Home Page
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageNotFound;
